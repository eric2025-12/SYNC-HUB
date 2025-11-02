import api from "./api";

const chatService = {
  getMessages: (conversationId) => api.get(`/chat/${conversationId}`),
  sendMessage: (data) => api.post("/chat/send", data),
};

export default chatService;
