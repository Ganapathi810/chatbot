# Nhost Authentication App

This application provides a complete real-time chat system with AI chatbot integration using Nhost, Hasura, and React.

## Features

- **Authentication**: Complete sign-in/sign-up flow using Nhost
- **Real-time Chat**: Live messaging with GraphQL subscriptions
- **AI Chatbot**: Automated responses via Hasura Actions
- **Chat Management**: Create, view, and manage multiple chat conversations
- **Message History**: Persistent storage of all conversations
- **Form Validation**: Comprehensive client-side validation with error messages
- **Responsive Design**: Mobile-first design that works on all devices
- **Loading States**: Visual feedback during authentication requests
- **Error Handling**: Proper error display for authentication failures
- **Protected Routes**: Automatic redirection based on authentication status

## Setup

1. **Create a Nhost Project**:
   - Go to [Nhost Console](https://console.nhost.io/)
   - Create a new project
   - Note your subdomain and region

2. **Set up Database Schema**:
   - Run the SQL migration in `src/hasura/migrations/001_create_chats_table.sql`
   - This creates the `chats` and `messages` tables with proper RLS policies

3. **Configure Hasura Action**:
   - Create a new Action in Hasura Console called `chatbot_response`
   - Set the handler URL to your deployed chatbot webhook
   - Use the code in `src/hasura/actions/chatbot_response.js` as reference

4. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Nhost project details:
     ```
     VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
     VITE_NHOST_REGION=your-nhost-region
     ```

5. **Install Dependencies**:
   ```bash
   npm install
   ```

6. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Pages

- **Sign In** (`/signin`): User authentication page
- **Sign Up** (`/signup`): User registration page  
- **Chat Home** (`/chat`): Main chat interface with real-time messaging

## Chat Features

- **Chat List**: View all your conversations with latest message preview
- **Real-time Messaging**: Messages appear instantly using GraphQL subscriptions
- **AI Responses**: Chatbot automatically responds to user messages
- **Message History**: All conversations are saved and can be resumed
- **Multiple Chats**: Create and manage multiple conversation threads
## Validation Rules

- **Email**: Must be a valid email format
- **Password**: 
  - Required for sign-in
  - Minimum 6 characters for sign-up
- **Empty Fields**: Form submission blocked with error messages

## Technical Architecture

- **Frontend**: React with TypeScript and Tailwind CSS
- **Authentication**: Nhost Auth with email/password
- **Database**: PostgreSQL with Hasura GraphQL API
- **Real-time**: GraphQL subscriptions over WebSocket
- **AI Integration**: Hasura Actions for chatbot responses
- **State Management**: Apollo Client for GraphQL state management