import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useUserData } from '@nhost/react';
import { GET_CHATS, CREATE_CHAT } from '../graphql/queries';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MessageView from './MessageView';
import { MessageCircle, Sparkles } from 'lucide-react';

const ChatHome: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasCreatedInitialChat, setHasCreatedInitialChat] = useState(false);
  const { data } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });
  const user = useUserData();

  const chats = data?.chats || [];
  const selectedChat = chats.find((chat: any) => chat.id === selectedChatId);

  // Auto-create and select first chat after login
  useEffect(() => {
    if (user?.id && chats.length === 0 && !hasCreatedInitialChat) {
      const createInitialChat = async () => {
        try {
          const result = await createChat({
            variables: {
              title: `New Chat ${new Date().toLocaleString()}`,
              userId: user.id,
            },
          });
          if (result.data?.insert_chats_one) {
            setSelectedChatId(result.data.insert_chats_one.id);
            setHasCreatedInitialChat(true);
          }
        } catch (err) {
          console.error('Error creating initial chat:', err);
        }
      };
      createInitialChat();
    }
  }, [user?.id, chats.length, hasCreatedInitialChat, createChat]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            // Trigger new chat creation
            break;
          case 'b':
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
            break;
        }
      }
      if (e.key === 'Escape') {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex w-full">
        {/* Sidebar */}
        <Sidebar
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar />

          {/* Chat Content */}
          {selectedChatId ? (
            <MessageView chatId={selectedChatId} />
          ) : (
            <div className="flex-1 flex items-center justify-center relative">
              <div className="text-center max-w-2xl mx-auto px-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl mb-8 shadow-2xl shadow-orange-500/30 animate-bounce-subtle">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome to ChatMind AI
                  </h2>
                  <Sparkles className="w-8 h-8 text-orange-400 ml-3 animate-twinkle" />
                </div>
                
                <p className="text-xl text-orange-400 font-medium mb-6">
                  Your Intelligent Conversation Partner
                </p>
                
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Start a new conversation or select an existing chat from the sidebar to continue where you left off
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
                    <h3 className="font-semibold text-white mb-2">🚀 AI-Powered</h3>
                    <p className="text-sm text-gray-400">Advanced AI responses with context awareness</p>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
                    <h3 className="font-semibold text-white mb-2">⚡ Real-time</h3>
                    <p className="text-sm text-gray-400">Instant messaging with live updates</p>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
                    <h3 className="font-semibold text-white mb-2">💾 Persistent</h3>
                    <p className="text-sm text-gray-400">All conversations saved automatically</p>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
                    <h3 className="font-semibold text-white mb-2">🎨 Beautiful</h3>
                    <p className="text-sm text-gray-400">Modern, responsive design</p>
                  </div>
                </div>
                
                <div className="mt-8 text-sm text-gray-500">
                  <p>Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+N</kbd> New Chat • <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+B</kbd> Toggle Sidebar</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHome;