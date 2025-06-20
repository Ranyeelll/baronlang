/// <reference types="vite/client" />

import { useEffect, useState, useRef, useCallback } from 'react';

// A simple debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const emotions = [{
  emoji: '😊',
  label: 'Happy'
}, {
  emoji: '😐',
  label: 'Neutral'
}, {
  emoji: '😔',
  label: 'Sad'
}, {
  emoji: '😫',
  label: 'Stressed'
}, {
  emoji: '🤔',
  label: 'Confused'
}];

export const EmotionLogger = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setSelectedEmotion(null);
        setCurrentMessage('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced version of the API call logic
  const debouncedFetch = useCallback(debounce(async (label: string) => {
    setCurrentMessage('');
    setLoading(true);

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      setCurrentMessage("Please configure your Gemini API key in the .env file. See README for instructions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Give me a short motivational or emotional message for someone feeling ${label.toLowerCase()}.`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error.message || 'API request failed');
      }

      const data = await response.json();
      if (!data.candidates || data.candidates.length === 0) {
        console.error("Invalid response from API:", data);
        throw new Error("No message content received from API.");
      }
      const message = data.candidates[0].content.parts[0].text;
      setCurrentMessage(message);
    } catch (error) {
      console.error("Full error details:", error);
      if (!GEMINI_API_KEY) {
        setCurrentMessage("Please configure your Gemini API key in the .env file. See README for instructions.");
      } else if (error instanceof Error && error.message.includes('quota')) {
        setCurrentMessage("I'm feeling a bit overwhelmed! Please try again in a moment.");
      } else if (error instanceof Error && error.message.includes('API key')) {
        setCurrentMessage("Invalid API key. Please check your configuration.");
      } else {
        setCurrentMessage("Sorry, I couldn't fetch a message right now. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, 500), [GEMINI_API_KEY]); // 500ms debounce delay

  const handleEmotionClick = (label: string) => {
    setSelectedEmotion(label);
    debouncedFetch(label);
  };

  return <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 p-6 rounded-lg border border-purple-100">
    <h2 className="text-lg font-medium text-purple-900 mb-4">
      How are you feeling?
    </h2>
    <div className="flex gap-4 mb-6">
      {emotions.map(({
        emoji,
        label
      }) => <button key={label} onClick={() => handleEmotionClick(label)} className={`p-3 rounded-lg transition-all ${selectedEmotion === label ? 'bg-white shadow-sm scale-110 ring-2 ring-purple-200' : 'hover:bg-white/50'}`}>
          <span className="text-2xl" role="img" aria-label={label}>
            {emoji}
          </span>
        </button>)}
    </div>
    {(selectedEmotion || loading) && (
      <div ref={messageRef} className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
        {loading ? (
          <p className="text-purple-800">Generating a message for you...</p>
        ) : (
          <p className="text-purple-800">{currentMessage}</p>
        )}
      </div>
    )}
  </div>;
};