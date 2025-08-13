import React, { useState } from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { LogOut, MessageCircle } from 'lucide-react';
import ChatList from './ChatList';
import MessageView from './MessageView';

const ChatHome: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chat Assistant</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatList 
          selectedChatId={selectedChatId} 
          onSelectChat={setSelectedChatId} 
        />
        
        {selectedChatId ? (
          <MessageView chatId={selectedChatId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Welcome to Chat Assistant
              </h2>
              <p className="text-gray-600 mb-4">
                Select a chat from the sidebar or create a new one to start chatting
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-md">
                <h3 className="font-medium text-gray-900 mb-2">Features:</h3>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Real-time messaging with GraphQL subscriptions</li>
                  <li>• AI-powered chatbot responses</li>
                  <li>• Create and manage multiple chats</li>
                  <li>• Persistent message history</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHome;