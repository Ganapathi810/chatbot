import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useUserData } from '@nhost/react';
import { GET_CHATS, CREATE_CHAT } from '../graphql/queries';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MessageView from './MessageView';
import { MessageCircle, Sparkles, Send } from 'lucide-react';

const ChatHome: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasCreatedInitialChat, setHasCreatedInitialChat] = useState(false);
  const [newChatIds, setNewChatIds] = useState<Set<string>>(new Set());
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
            setNewChatIds(prev => new Set(prev).add(result.data.insert_chats_one.id));
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
        {/* Mobile Overlay */}
        {!isCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}

        {/* Sidebar */}
        <div className={`${isCollapsed ? 'hidden lg:flex' : 'fixed lg:relative'} inset-y-0 left-0 z-50 lg:z-auto`}>
          <Sidebar
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onNewChatCreated={(chatId) => setNewChatIds(prev => new Set(prev).add(chatId))}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />

          {/* Chat Content */}
          {selectedChatId ? (
            <MessageView 
              chatId={selectedChatId} 
              isNewChat={newChatIds.has(selectedChatId)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 sm:px-6">
              <div className="text-center max-w-4xl mx-auto animate-fade-in">
                {/* Main Welcome Message */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8 sm:mb-12">
                  Ready when you are.
                </h1>
                
                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Smart Conversations</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Engage in intelligent discussions with context-aware AI responses</p>
                  </div>
                  
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Real-time Responses</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Get instant AI-powered responses with streaming text effects</p>
                  </div>
                  
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Chat History</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">All your conversations are automatically saved and organized</p>
                  </div>
                  
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 hover:scale-105 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-lg">Beautiful Design</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">Modern, responsive interface that works on all devices</p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4">
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-all duration-200 hover:scale-105 text-sm sm:text-base">
                    Explain quantum computing
                  </button>
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-all duration-200 hover:scale-105 text-sm sm:text-base">
                    Write a creative story
                  </button>
                  <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl border border-gray-600/50 hover:border-orange-500/30 transition-all duration-200 hover:scale-105 text-sm sm:text-base">
                    Help me plan a project
                  </button>
                </div>
                
                {/* Chat Input */}
                <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
                  <div className="relative">
                    <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-600/50 hover:border-gray-500/50 focus-within:border-orange-500/50 focus-within:shadow-lg focus-within:shadow-orange-500/20 transition-all duration-300">
                      <input
                        type="text"
                        placeholder="Ask anything"
                        className="w-full px-6 py-4 pr-16 bg-transparent text-white placeholder-gray-400 focus:outline-none rounded-full"
                      />
                      
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Keyboard Shortcuts */}
                <div className="mt-8 sm:mt-12 text-sm text-gray-500">
                  <p className="hidden sm:block">
                    Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+N</kbd> New Chat • <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl+B</kbd> Toggle Sidebar
                  </p>
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