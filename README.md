# ChatMind AI

A modern, real-time AI chat application built with React, TypeScript, and Supabase. Experience intelligent conversations with a beautiful, responsive interface.

![ChatMind AI](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 📖 Project Overview

ChatMind AI is a full-stack chat application that enables users to have real-time conversations with an AI assistant. The app features user authentication, multiple chat threads, message history, and a responsive design that works seamlessly across all devices.

### Key Features
- 🔐 Secure user authentication
- 💬 Real-time messaging with AI responses
- 📱 Fully responsive design
- 🎨 Modern dark theme with smooth animations
- 💾 Persistent chat history
- 🔄 Multiple chat conversations

## 🔄 Application Flow

```
User Registration/Login → Chat Dashboard → Create/Select Chat → Send Message → AI Response
```

### Technical Flow
```
React Frontend ↔ Apollo Client ↔ Supabase GraphQL API ↔ PostgreSQL Database
                                        ↓
                              Hasura Actions (AI Integration)
```

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Apollo Client** - GraphQL client for state management and API calls
- **React Router** - Client-side routing with protected routes
- **Vite** - Fast build tool and development server

### Backend
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with Row Level Security
- **GraphQL** - API query language with real-time subscriptions
- **Hasura Actions** - Custom business logic for AI integration
- **WebSocket** - Real-time bidirectional communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chatmind-ai.git
cd chatmind-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [Supabase Console](https://supabase.com/dashboard)
   - Run the SQL migration from `supabase/migrations/` in your Supabase SQL editor
   - Get your project URL and anon key

4. **Configure environment variables**
Create a `.env` file:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── SignIn.tsx       # User authentication
│   ├── SignUp.tsx       # User registration
│   ├── ChatHome.tsx     # Main chat interface
│   ├── Sidebar.tsx      # Chat navigation
│   ├── MessageView.tsx  # Message display
│   └── ...
├── graphql/             # GraphQL queries and mutations
├── lib/                 # Configuration files
└── supabase/           # Database migrations
```

## 🔒 Database Schema

### Tables
- **chats** - Store chat conversations
- **messages** - Store individual messages with user/bot identification

### Security
- Row Level Security (RLS) ensures users only access their own data
- Authentication required for all operations

## 🎨 Features in Detail

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes with automatic redirection
- Secure session management

### Real-time Chat
- Instant message delivery using GraphQL subscriptions
- AI responses via Hasura Actions
- Typing indicators and message streaming
- Auto-scroll behavior like ChatGPT

### User Interface
- Mobile-first responsive design
- Dark theme with orange accents
- Smooth animations and micro-interactions
- Collapsible sidebar for mobile

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Backend
Supabase handles all backend infrastructure automatically.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Supabase for the backend platform
- React team for the frontend framework
- Tailwind CSS for the styling system

---

**Experience the future of AI conversations with ChatMind AI!**