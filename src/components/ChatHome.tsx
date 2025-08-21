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

  // Auto-collapse sidebar on mobile when chat is selected
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Auto-close sidebar on mobile screens
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  };

  // Handle window resize to auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    // Check initial screen size
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-create and select first chat after login
  useEffect(() => {
    if (user?.id && !hasCreatedInitialChat) {
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
  }, [user?.id, hasCreatedInitialChat, createChat]);

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
            onSelectChat={handleSelectChat}
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
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 sm:mb-6">
                  Welcome to ChatMind AI
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-12">
                  Your intelligent conversation partner. Start a new chat to begin exploring ideas, getting answers, and having meaningful conversations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHome;