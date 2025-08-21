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

### AI Response Workflow (n8n Integration)
```
Hasura Action → Webhook → Check Chat Ownership → Merge Data → OpenRouter API → Format Response → Save to Database → Response
```

### Technical Flow
```
React Frontend ↔ Apollo Client ↔ Supabase GraphQL ↔ PostgreSQL Database
                                        ↓
                              Hasura Actions → n8n Workflow
                                        ↓
                              OpenRouter (GPT-3.5-turbo)
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
- **n8n** - Workflow automation platform
- **OpenRouter** - AI API gateway (GPT-3.5-turbo)
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
HASURA_GRAPHQL_ENDPOINT=your-hasura-endpoint
HASURA_ADMIN_SECRET=your-hasura-admin-secret
OPENROUTER_API_KEY=your-openrouter-api-key
```

5. **Set up n8n workflow and Hasura Actions**
   - Create Hasura Action for `chatbot_response`
   - Import the n8n workflow configuration
   - Configure OpenRouter API integration
   - Set up webhook endpoint in n8n

6. **Start the development server**
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
├── supabase/           # Database migrations
└── workflows/          # n8n workflow configurations
```

## 🤖 AI Integration

The application uses **Hasura Actions + n8n workflow** to process AI responses through OpenRouter:

### n8n Workflow Steps:

1. **Hasura Action → Webhook**
   - Hasura calls a webhook when a user sends a chat message
   - The webhook request contains the user's Bearer token (from Nhost authentication)

2. **Check Chat Ownership (GraphQL Node)**
   - A GraphQL query checks if the chat belongs to the logged-in user
   - If the chat exists, it is returned

3. **Merge Webhook + GraphQL Data**
   - Combines the Bearer token from the webhook
   - Combines the chat data from GraphQL

4. **If Node (Does Chat Exist?)**
   - If the chat exists → continue
   - If not → return an error or stop the workflow

5. **Call OpenRouter (HTTP Request)**
   - Sends the chat message to OpenRouter using the model `openai/gpt-3.5-turbo`
   - Gets back the AI's response

6. **Merge AI Response + Token**
   - Combines the AI response with the user's Bearer token

7. **Format Response (Code Node)**
   - Formats the OpenRouter response into clean JSON

8. **Save to Hasura (GraphQL Mutation)**
   - Stores the AI response in the database, linked to the correct chat and user

9. **Send Response Back**
   - Sends the AI response back to Hasura, completing the action

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