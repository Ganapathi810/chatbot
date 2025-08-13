// Hasura Action Handler for Chatbot Response
// This should be deployed as a serverless function or webhook endpoint

const handler = async (req, res) => {
  const { chat_id, message } = req.body.input;
  
  try {
    // Simulate AI chatbot response (replace with actual AI service)
    const botResponse = await generateBotResponse(message);
    
    // Insert bot message into database
    const mutation = `
      mutation InsertBotMessage($chatId: uuid!, $content: String!) {
        insert_messages_one(
          object: { 
            chat_id: $chatId, 
            content: $content, 
            is_bot: true,
            user_id: "00000000-0000-0000-0000-000000000000"
          }
        ) {
          id
          content
          created_at
        }
      }
    `;
    
    const response = await fetch(process.env.HASURA_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          chatId: chat_id,
          content: botResponse,
        },
      }),
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    res.json({
      response: botResponse,
      success: true,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      response: "I'm sorry, I'm having trouble responding right now. Please try again.",
      success: false,
    });
  }
};

// Simple chatbot response generator (replace with actual AI service)
async function generateBotResponse(message) {
  const responses = [
    "That's an interesting point! Can you tell me more about that?",
    "I understand what you're saying. How does that make you feel?",
    "Thanks for sharing that with me. What would you like to explore next?",
    "That's a great question! Let me think about that for a moment...",
    "I appreciate you bringing that up. Can you provide more context?",
    "That sounds important to you. Would you like to discuss it further?",
    "I see what you mean. What are your thoughts on how to approach this?",
    "That's a valuable insight. How did you come to that conclusion?",
  ];
  
  // Simple response selection (replace with actual AI logic)
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add a small delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  return randomResponse;
}

module.exports = handler;