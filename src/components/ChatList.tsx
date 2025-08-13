import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHATS, CREATE_CHAT } from '../graphql/queries';
import { MessageCircle, Plus } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    content: string;
    created_at: string;
    is_bot: boolean;
  }>;
}

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onSelectChat }) => {
  const { data, loading, error } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });

  const handleCreateChat = async () => {
    try {
      const result = await createChat({
        variables: {
          title: `Chat ${new Date().toLocaleString()}`,
        },
      });
      if (result.data?.insert_chats_one) {
        onSelectChat(result.data.insert_chats_one.id);
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <p className="text-red-600">Error loading chats</p>
      </div>
    );
  }

  const chats: Chat[] = data?.chats || [];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleCreateChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No chats yet</p>
            <p className="text-sm">Create your first chat to get started</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedChatId === chat.id
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.title}
                    </h3>
                    {chat.messages.length > 0 && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {chat.messages[0].content}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;