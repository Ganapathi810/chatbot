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
  const [isCreatingInitialChat, setIsCreatingInitialChat] = useState(false);
  const [hasAttemptedInitialChat, setHasAttemptedInitialChat] = useState(false);
  const [newChatIds, setNewChatIds] = useState<Set<string>>(new Set());
  const { data } = useQuery(GET_CHATS, {
    fetchPolicy: 'cache-and-network',
  });
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
    // Only create initial chat if user exists, no chats exist, data is loaded, we haven't started creating one, and haven't attempted before
    if (user?.id && data && chats.length === 0 && !isCreatingInitialChat && !hasAttemptedInitialChat) {
      const createInitialChat = async () => {
        setIsCreatingInitialChat(true);
        setHasAttemptedInitialChat(true);
        try {
          const result = await createChat({
            variables: {
              title: `New Chat 1`,
              userId: user.id,
            },
          });
          if (result.data?.insert_chats_one) {
            const newChatId = result.data.insert_chats_one.id;
            setSelectedChatId(newChatId);
            setNewChatIds(prev => new Set(prev).add(newChatId));
          }
        } catch (err) {
          console.error('Error creating initial chat:', err);
        } finally {
          setIsCreatingInitialChat(false);
        }
      };
      createInitialChat();
    }
  }, [user?.id, data, chats.length, isCreatingInitialChat, hasAttemptedInitialChat, createChat]);

  // Reset the attempt flag when user changes (for proper cleanup)
  useEffect(() => {
    if (!user?.id) {
      setHasAttemptedInitialChat(false);
      setIsCreatingInitialChat(false);
    }
  }, [user?.id]);

  // Select first available chat if none is selected
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

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

  const handleCreateChat = async () => {
    try {
      // Calculate the next chat number
      const chatNumbers = chats
        .map(chat => {
          const match = chat.title.match(/New Chat (\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(num => num > 0);
      
      const nextNumber = chatNumbers.length > 0 ? Math.max(...chatNumbers) + 1 : chats.length + 1;
      
      const result = await createChat({
        variables: {
          title: `New Chat ${nextNumber}`,
          userId: user?.id,
        },
      });
      if (result.data?.insert_chats_one) {
        const newChatId = result.data.insert_chats_one.id;
        setSelectedChatId(newChatId);
        setNewChatIds(prev => new Set(prev).add(newChatId));
        
        // Auto-close sidebar on mobile after creating chat
        if (window.innerWidth < 1024) {
          setIsCollapsed(true);
        }
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

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
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          {/* Top Bar */}
          <TopBar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />

          {/* Chat Content */}
          {selectedChatId ? (
            <div className="flex-1 min-h-0">
              <MessageView 
                chatId={selectedChatId} 
                isNewChat={newChatIds.has(selectedChatId)}
                isCollapsed={isCollapsed}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHome;