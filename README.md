# ChatMind AI

A modern, real-time AI chat application built with React, TypeScript, and Supabase. Experience intelligent conversations with a beautiful, responsive interface inspired by leading AI platforms.

![ChatMind AI](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Authentication**: Email/password authentication powered by Supabase Auth
- **Protected Routes**: Automatic redirection based on authentication status
- **Row Level Security**: Database-level security ensuring users only access their own data
- **Form Validation**: Comprehensive client-side validation with real-time error feedback

### 💬 Real-time Chat Experience
- **Instant Messaging**: Real-time message delivery using GraphQL subscriptions
- **AI Chatbot Integration**: Intelligent responses via Hasura Actions
- **Multiple Conversations**: Create and manage unlimited chat threads
- **Message History**: Persistent storage of all conversations with full search capability
- **Typing Indicators**: Visual feedback showing when AI is generating responses
- **Message Streaming**: ChatGPT-style streaming text animation for bot responses

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach that works perfectly on all devices
- **Dark Theme**: Beautiful dark interface with orange accent colors
- **Smooth Animations**: Micro-interactions and transitions for enhanced user experience
- **Auto-scroll**: Intelligent scrolling behavior that follows new messages
- **Collapsible Sidebar**: Space-efficient navigation with mobile-friendly design
- **Loading States**: Visual feedback during all async operations

### 🚀 Performance & Reliability
- **Optimistic Updates**: Instant UI feedback before server confirmation
- **Caching Strategy**: Smart Apollo Client caching for faster load times
- **Error Handling**: Graceful error recovery with user-friendly messages
- **Offline Support**: Basic offline functionality with automatic reconnection

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vite** - Lightning-fast build tool and development server
- **React Router** - Client-side routing with protected routes

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Hasura** - GraphQL API with real-time subscriptions
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - WebSocket-based live updates

### State Management & API
- **Apollo Client** - GraphQL client with caching and subscriptions
- **GraphQL** - Type-safe API queries and mutations
- **WebSocket** - Real-time bidirectional communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Basic knowledge of React and TypeScript

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/chatmind-ai.git
cd chatmind-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [Supabase Console](https://supabase.com/dashboard)
2. Create a new project
3. Note your project URL and anon key

#### Set Up Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Run the migration file: `supabase/migrations/20250812112719_frosty_delta.sql`
3. This creates the `chats` and `messages` tables with proper RLS policies

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Set Up AI Chatbot (Optional)
To enable AI responses, you'll need to set up a Hasura Action:

1. Go to your Supabase dashboard → API → GraphQL
2. Create a new Action called `chatbot_response`
3. Use the handler code in `src/hasura/actions/chatbot_response.js`
4. Deploy it as a serverless function (Vercel, Netlify, etc.)

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app running!

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── SignIn.tsx       # Authentication - Sign in page
│   ├── SignUp.tsx       # Authentication - Sign up page
│   ├── ChatHome.tsx     # Main chat interface
│   ├── Sidebar.tsx      # Chat list and navigation
│   ├── MessageView.tsx  # Message display and input
│   ├── MessageBubble.tsx # Individual message component
│   ├── ChatInput.tsx    # Message input with suggestions
│   ├── TypingIndicator.tsx # AI thinking animation
│   └── TopBar.tsx       # Header navigation
├── graphql/             # GraphQL queries and mutations
│   └── queries.ts       # All GraphQL operations
├── lib/                 # Configuration and utilities
│   ├── nhost.ts        # Supabase client configuration
│   └── apollo.ts       # Apollo Client setup
├── hasura/             # Backend integration
│   └── actions/        # Hasura action handlers
└── supabase/           # Database migrations
    └── migrations/     # SQL migration files
```

## 🔧 Configuration

### Authentication Settings
The app uses email/password authentication with the following features:
- Email verification (can be disabled in Supabase settings)
- Secure password requirements (minimum 6 characters)
- Automatic session management
- Protected route handling

### Database Schema
The application uses two main tables:

#### `chats` Table
- `id` - Unique chat identifier
- `title` - Chat display name
- `user_id` - Owner of the chat
- `created_at` / `updated_at` - Timestamps

#### `messages` Table
- `id` - Unique message identifier
- `chat_id` - Associated chat
- `user_id` - Message author
- `content` - Message text
- `is_bot` - Boolean flag for AI messages
- `created_at` - Message timestamp

### Security Policies
Row Level Security (RLS) ensures:
- Users can only see their own chats and messages
- Messages are only visible within owned chats
- All operations are properly authenticated

## 🎨 Customization

### Theming
The app uses a dark theme with orange accents. To customize colors:

1. **Primary Colors**: Edit the orange color values in Tailwind classes
2. **Background**: Modify the gradient backgrounds in components
3. **Animations**: Customize animations in `src/index.css`

### AI Integration
To integrate with different AI services:

1. Modify `src/hasura/actions/chatbot_response.js`
2. Replace the mock responses with your AI service API calls
3. Update the response format as needed

### UI Components
All components are modular and can be easily customized:
- **MessageBubble**: Customize message appearance
- **Sidebar**: Modify navigation and chat list
- **ChatInput**: Add new features like file uploads
- **Animations**: Enhance with additional micro-interactions

## 📱 Mobile Experience

The app is fully responsive with:
- **Mobile-first design** - Optimized for touch interfaces
- **Collapsible sidebar** - Efficient use of screen space
- **Touch-friendly buttons** - Properly sized interactive elements
- **Smooth animations** - 60fps animations on mobile devices
- **Auto-scroll behavior** - Intelligent message scrolling

## 🔒 Security Features

### Authentication Security
- Secure password hashing via Supabase Auth
- JWT token-based session management
- Automatic token refresh
- Secure logout functionality

### Database Security
- Row Level Security (RLS) on all tables
- User isolation at the database level
- Prepared statements preventing SQL injection
- Encrypted data transmission

### Frontend Security
- XSS protection via React's built-in sanitization
- CSRF protection through SameSite cookies
- Secure environment variable handling
- Input validation and sanitization

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables in the deployment platform
3. Deploy with automatic builds on push

### Backend (Supabase)
- Supabase handles all backend infrastructure
- Automatic scaling and backups
- Global CDN for optimal performance

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🧪 Testing

### Running Tests
```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Test Structure
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API and database integration
- **E2E Tests**: Full user journey testing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend-as-a-service platform
- **React Team** - For the incredible frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Apollo GraphQL** - For the powerful GraphQL client
- **Lucide React** - For the beautiful icon library

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions
- **Email**: Contact us at support@chatmind-ai.com

## 🗺️ Roadmap

### Upcoming Features
- [ ] **File Uploads** - Share images and documents in chat
- [ ] **Voice Messages** - Record and send voice notes
- [ ] **Chat Export** - Export conversations as PDF/text
- [ ] **Advanced AI Models** - Integration with GPT-4, Claude, etc.
- [ ] **Team Workspaces** - Collaborative chat environments
- [ ] **Custom AI Personas** - Personalized AI assistants
- [ ] **Mobile Apps** - Native iOS and Android applications

### Performance Improvements
- [ ] **Message Pagination** - Efficient loading of chat history
- [ ] **Image Optimization** - Automatic image compression
- [ ] **Offline Mode** - Full offline functionality
- [ ] **PWA Features** - Progressive Web App capabilities

---

**Built with ❤️ by the ChatMind AI Team**

*Experience the future of AI conversations today!*