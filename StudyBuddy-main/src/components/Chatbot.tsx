import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, PlusCircle } from 'lucide-react';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

type ChatSession = {
    id: string;
    title: string;
    messages: Message[];
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const createNewSession = (): ChatSession => ({
        id: `session_${Date.now()}`,
        title: "New Chat",
        messages: [{ sender: 'bot', text: 'Hello! How can I help you with your studies today?' }],
    });

    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        const savedSessions = localStorage.getItem('chatSessions');
        if (savedSessions) {
            return JSON.parse(savedSessions);
        }
        return [createNewSession()];
    });

    const [currentSessionId, setCurrentSessionId] = useState<string>(sessions[0].id);

    useEffect(() => {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }, [sessions]);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const handleNewChat = () => {
        const newSession = createNewSession();
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
    };

    const handleDeleteChat = (sessionId: string) => {
        setSessions(prev => {
            const newSessions = prev.filter(s => s.id !== sessionId);
            // If we delete the current session, switch to another one or create a new one
            if (currentSessionId === sessionId) {
                if (newSessions.length > 0) {
                    setCurrentSessionId(newSessions[0].id);
                } else {
                    const newSession = createNewSession();
                    newSessions.push(newSession);
                    setCurrentSessionId(newSession.id);
                }
            }
            return newSessions;
        });
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: inputValue };

        setSessions(prevSessions => {
            return prevSessions.map(session => {
                if (session.id === currentSessionId) {
                    // Update title with first user message
                    const newTitle = session.messages.length === 1 ? inputValue.substring(0, 25) + '...' : session.title;
                    const updatedMessages = [...session.messages, userMessage];
                    return { ...session, title: newTitle, messages: updatedMessages };
                }
                return session;
            });
        });

        setInputValue('');
        setIsLoading(true);

        // Check if API key is available
        if (!apiKey) {
            const errorBotMessage: Message = {
                sender: 'bot',
                text: "Please configure your Gemini API key in the .env file. See README for instructions."
            };
            setSessions(prevSessions => prevSessions.map(session => {
                if (session.id === currentSessionId) {
                    return { ...session, messages: [...session.messages, errorBotMessage] };
                }
                return session;
            }));
            setIsLoading(false);
            return;
        }

        try {
            const prompt = inputValue;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error("No response content received from API.");
            }
            const botResponse = data.candidates[0].content.parts[0].text.trim();
            const newBotMessage: Message = { sender: 'bot', text: botResponse };

            setSessions(prevSessions => prevSessions.map(session => {
                if (session.id === currentSessionId) {
                    return { ...session, messages: [...session.messages, newBotMessage] };
                }
                return session;
            }));

        } catch (error) {
            console.error('Error fetching from Gemini:', error);
            let errorMessage = "Sorry, I'm having a little trouble right now. Please try again later.";

            if (error instanceof Error) {
                if (error.message.includes('API key')) {
                    errorMessage = "Invalid API key. Please check your configuration.";
                } else if (error.message.includes('quota')) {
                    errorMessage = "I'm feeling a bit overwhelmed! Please try again in a moment.";
                }
            }

            const errorBotMessage: Message = { sender: 'bot', text: errorMessage };
            setSessions(prevSessions => prevSessions.map(session => {
                if (session.id === currentSessionId) {
                    return { ...session, messages: [...session.messages, errorBotMessage] };
                }
                return session;
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

    return (
        <div>
            {/* Chatbot toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-[#8B0000] text-white p-4 rounded-full shadow-lg hover:bg-[#A52A2A] transition-transform transform hover:scale-110 z-50"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X /> : <MessageSquare />}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[550px] h-[500px] bg-white rounded-lg shadow-2xl flex z-50">
                    {/* Sidebar */}
                    <div className="w-1/3 bg-gray-100 border-r flex flex-col">
                        <div className="p-2 border-b">
                            <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300">
                                <PlusCircle size={18} /> New Chat
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {sessions.map(session => (
                                <div key={session.id} onClick={() => setCurrentSessionId(session.id)}
                                    className={`p-2 m-2 rounded-md cursor-pointer flex justify-between items-center ${currentSessionId === session.id ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>
                                    <span className="text-sm truncate">{session.title}</span>
                                    {sessions.length > 1 &&
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteChat(session.id); }} className="text-gray-500 hover:text-red-600 p-1">
                                            <Trash2 size={14} />
                                        </button>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="w-2/3 flex flex-col">
                        <div className="bg-[#8B0000] text-white p-4 rounded-tr-lg flex justify-between items-center">
                            <h3 className="font-bold text-lg">StudyBuddy Assistant</h3>
                            <button onClick={() => setIsOpen(false)} title="Close Chat"><X size={20} /></button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {currentSession.messages.map((msg, index) => (
                                <div key={index} className={`flex mb-3 ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'bot' ? 'bg-gray-200 text-gray-800' : 'bg-[#8B0000] text-white'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-3">
                                    <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask for help or motivation..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="ml-3 px-4 py-2 bg-[#8B0000] text-white rounded-md hover:bg-[#A52A2A] disabled:bg-[#A52A2A]/50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 