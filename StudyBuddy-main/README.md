# StudyBuddy

A comprehensive study management application with task tracking, calendar events, emotion logging, and AI-powered chatbot assistance.

## Features

- **Task Management**: Create, edit, and track your study tasks
- **Calendar Integration**: Schedule and manage important events
- **Emotion Logger**: Track your mood with AI-powered motivational messages
- **AI Chatbot**: Get study help and motivation from StudyBuddy assistant
- **Progress Tracking**: Monitor your study progress
- **User Authentication**: Secure login and signup system

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StudyBuddy-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Gemini AI API Key**
   
   The EmotionLogger and Chatbot features require a Gemini AI API key from Google AI Studio.
   
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Create a `.env` file in the root directory with:
     ```
     VITE_GEMINI_API_KEY=AIzaSyDXAlc7cKr0zV1rPLNeUefRJUvFJdpxUM4
     ```
   
   **Note**: Replace `AIzaSyDXAlc7cKr0zV1rPLNeUefRJUvFJdpxUM4` with your actual Gemini API key.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## Demo Login

For testing purposes, you can use these demo credentials:
- **Email**: demo@example.com
- **Password**: password

## Features in Detail

### Emotion Logger
- Click on emojis to log your current mood
- Receive AI-generated motivational messages based on your emotion
- Requires valid Gemini API key to function

### AI Chatbot
- Get study help and motivation
- Maintains chat history across sessions
- Requires valid Gemini API key to function

### Task Management
- Create tasks with due dates and subjects
- Mark tasks as completed
- View upcoming and completed tasks

### Calendar
- Schedule important events
- View events on the dashboard
- Manage your study schedule

## Troubleshooting

### EmotionLogger/Chatbot not working?
1. Check that you have created a `.env` file with your Gemini API key
2. Ensure the API key is valid and has sufficient quota
3. Check the browser console for any error messages

### API Quota Issues?
The Gemini API has rate limits. If you encounter quota errors, wait a moment and try again.

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI API
- React Router
- Lucide React Icons
