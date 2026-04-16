import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const chatService = {
  getConversations: async () => {
    const response = await api.get(ENDPOINTS.messages.getConversations);
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(ENDPOINTS.messages.getMessages(conversationId));
    return response.data;
  },

  createOrGetConversation: async (receiverId) => {
    const response = await api.post(ENDPOINTS.messages.createConversation, { receiverId });
    return response.data;
  },

  sendMessage: async (conversationId, text, attachmentUrl = "", attachmentType = "", replyTo = null) => {
    const response = await api.post(ENDPOINTS.messages.sendMessage, { conversationId, text, attachmentUrl, attachmentType, replyTo });
    return response.data;
  },

  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/messages/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await api.put(ENDPOINTS.messages.markAsRead(conversationId));
    return response.data;
  },

  editMessage: async (messageId, text) => {
    const response = await api.put(`/messages/${messageId}/edit`, { text });
    return response.data;
  },

  deleteMessageForMe: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}/delete-me`);
    return response.data;
  },

  deleteMessageForEveryone: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}/delete-everyone`);
    return response.data;
  },

  bulkDeleteForMe: async (messageIds) => {
    const response = await api.delete(`/messages/bulk-delete`, { data: { messageIds } });
    return response.data;
  },

  reactToMessage: async (messageId, emoji) => {
    const response = await api.put(`/messages/${messageId}/react`, { emoji });
    return response.data;
  },
};
