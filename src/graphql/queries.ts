import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: desc }, limit: 1) {
        content
        created_at
        is_bot
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $content: String!, $userId: uuid!) {
    insert_messages_one(
      object: { 
        chat_id: $chatId, 
        content: $content, 
        user_id: $userId,
        is_bot: false 
      }
    ) {
      id
      content
      created_at
      is_bot
    }
  }
`;

export const TRIGGER_CHATBOT = gql`
  mutation TriggerChatbot($chatId: uuid!, $message: String!) {
    chatbot_response(chat_id: $chatId, message: $message) {
      response
      success
    }
  }
`;