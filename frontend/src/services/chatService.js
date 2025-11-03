// services/chatService.js
import api from './api';

/**
 * Chat service for handling chat-related API requests
 */
const chatService = {
  /**
   * Get messages for a specific conversation
   * @param {string|number} conversationId - ID of the conversation
   * @returns {Promise<Object>} - Messages data from backend
   */
  getMessages: async (conversationId) => {
    try {
      const res = await api.get(`/chat/${conversationId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * Send a message to a conversation
   * @param {Object} data - Message payload (e.g., conversationId, senderId, text)
   * @returns {Promise<Object>} - Response data from backend
   */
  sendMessage: async (data) => {
    try {
      const res = await api.post('/chat/send', data);
      return res.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
};

export default chatService;
