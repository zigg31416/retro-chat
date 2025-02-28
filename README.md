# Retro Chat App

A 80s/90s-inspired temporary chat application built with React and Supabase. The app features a retro-style UI with neon colors, pixelated fonts, VHS glitch effects, and bold geometric shapes.

## Features

- **Host a Chatroom**: Create a room with a unique 5-digit code
- **Join a Chatroom**: Join existing rooms using the room code
- **Real-Time Messaging**: Instant chat with all connected users
- **User Exit Notifications**: Alerts when users leave the chat
- **Host Approval**: Room hosts approve join requests
- **Temporary Chats**: All messages are deleted when everyone leaves

## Tech Stack

- **Frontend**: React with Vite
- **Styling**: Styled-components for retro UI
- **Animation**: Framer Motion for smooth animations
- **Audio**: Howler.js for sound effects
- **Backend**: Supabase for real-time database and chat
- **Deployment**: Vercel

## Screenshots

(Screenshots will be added here)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/retro-chat-app.git
   cd retro-chat-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Set up your Supabase database with the SQL schema provided in `supabase-setup.sql`

5. Start the development server:
   ```
   npm run dev
   ```

## Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!


## Acknowledgements

- Inspired by 80s/90s aesthetics and retro computing
- Sound effects from [FreeSound](https://freesound.org/)
- Fonts from [Google Fonts](https://fonts.google.com/) and [DaFont](https://www.dafont.com/)
