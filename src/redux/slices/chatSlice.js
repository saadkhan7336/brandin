import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatService } from "../../services/chatService";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue, getState }) => {
    try {
      const data = await chatService.getConversations();
      const currentUser = getState().auth.user;
      
      const uniqueConversations = [];
      const seenPartners = new Set();
      
      (data.data || []).forEach(conv => {
          const partner = conv.participants.find((p) => String(p._id) !== String(currentUser?._id));
          const partnerId = partner?._id;
          if (partnerId) {
             const pStr = String(partnerId);
             if (!seenPartners.has(pStr)) {
                 seenPartners.add(pStr);
                 uniqueConversations.push(conv);
             }
          } else {
             uniqueConversations.push(conv);
          }
      });
      return uniqueConversations;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const data = await chatService.getMessages(conversationId);
      return { conversationId, messages: data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, text, attachmentUrl = "", attachmentType = "", replyTo = null }, { rejectWithValue }) => {
    try {
      const data = await chatService.sendMessage(conversationId, text, attachmentUrl, attachmentType, replyTo);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  "chat/uploadAttachment",
  async (file, { rejectWithValue }) => {
    try {
      const data = await chatService.uploadAttachment(file);
      return data.data; // should contain url
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      await chatService.markAsRead(conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editMessageItem = createAsyncThunk(
  "chat/editMessageItem",
  async ({ messageId, text }, { rejectWithValue }) => {
    try {
      const data = await chatService.editMessage(messageId, text);
      return data.data;
    } catch (error) {
       return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMessageMe = createAsyncThunk(
  "chat/deleteMessageMe",
  async ({ messageId, conversationId }, { rejectWithValue }) => {
    try {
      await chatService.deleteMessageForMe(messageId);
      return { messageId, conversationId };
    } catch (error) {
       return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMessageGlobal = createAsyncThunk(
  "chat/deleteMessageGlobal",
  async (messageId, { rejectWithValue }) => {
    try {
      const data = await chatService.deleteMessageForEveryone(messageId);
      return data.data;
    } catch (error) {
       return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkDeleteForMe = createAsyncThunk(
  "chat/bulkDeleteForMe",
  async ({ messageIds, conversationId }, { rejectWithValue }) => {
    try {
      await chatService.bulkDeleteForMe(messageIds);
      return { messageIds, conversationId };
    } catch (error) {
       return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const reactToMessageItem = createAsyncThunk(
  "chat/reactToMessageItem",
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const data = await chatService.reactToMessage(messageId, emoji);
      return data.data;
    } catch (error) {
       return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    messages: {}, // { conversationId: [messages...] }
    activeConversation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversation = action.payload;
    },
    receiveMessage(state, action) {
      const msg = action.payload;
      if (!state.messages[msg.conversationId]) {
        state.messages[msg.conversationId] = [];
      }
      
      const exists = state.messages[msg.conversationId].some((m) => m._id === msg._id);
      if (!exists) {
        state.messages[msg.conversationId].push(msg);
      }
      
      // Update last message in conversations list
      const convIndex = state.conversations.findIndex((c) => c._id === msg.conversationId);
      if (convIndex !== -1) {
        state.conversations[convIndex].lastMessage = {
          text: msg.text,
          sender: msg.sender,
          createdAt: msg.createdAt,
          isRead: false,
        };
      }
    },
    markConversationReadLocal(state, action) {
      const conversationId = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId].forEach(msg => msg.isRead = true);
      }
      const convIndex = state.conversations.findIndex(c => c._id === conversationId);
      if (convIndex !== -1 && state.conversations[convIndex].lastMessage) {
        state.conversations[convIndex].lastMessage.isRead = true;
      }
    },
    updateMessageLocal(state, action) {
      const msg = action.payload; 
      if (!msg || !state.messages[msg.conversationId]) return;
      const index = state.messages[msg.conversationId].findIndex(m => m._id === msg._id);
      if (index !== -1) {
        state.messages[msg.conversationId][index] = msg;
      }
      
      const convIndex = state.conversations.findIndex((c) => c._id === msg.conversationId);
      if (convIndex !== -1) {
        if (state.conversations[convIndex].lastMessage && String(state.conversations[convIndex].lastMessage.createdAt) === String(msg.createdAt)) {
          state.conversations[convIndex].lastMessage = {
             text: msg.text,
             sender: msg.sender._id || msg.sender,
             createdAt: msg.createdAt,
             isRead: msg.isRead,
             attachmentUrl: msg.attachmentUrl,
             attachmentType: msg.attachmentType,
          };
        }
      }
    },
    removeMessageLocal(state, action) {
       const { conversationId, messageId } = action.payload;
       if (!state.messages[conversationId]) return;
       state.messages[conversationId] = state.messages[conversationId].filter(m => m._id !== messageId);
    },
    removeMultipleMessagesLocal(state, action) {
      const { conversationId, messageIds } = action.payload;
      if (!state.messages[conversationId]) return;
      state.messages[conversationId] = state.messages[conversationId].filter(m => !messageIds.includes(m._id));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload || [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages || [];
        
        const convIndex = state.conversations.findIndex(c => c._id === conversationId);
        if (convIndex !== -1 && state.conversations[convIndex].lastMessage) {
            state.conversations[convIndex].lastMessage.isRead = true;
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        if (!state.messages[msg.conversationId]) {
          state.messages[msg.conversationId] = [];
        }
        
        const exists = state.messages[msg.conversationId].some((m) => m._id === msg._id);
        if (!exists) {
          state.messages[msg.conversationId].push(msg);
        }

        // Update last message in conversations list
        const convIndex = state.conversations.findIndex((c) => c._id === msg.conversationId);
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = {
            text: msg.text,
            sender: msg.sender,
            createdAt: msg.createdAt,
            isRead: true, // We sent it, it gets true to avoid unread marker on sender side, but it depends how we want grey/blue checks
            attachmentUrl: msg.attachmentUrl,
            attachmentType: msg.attachmentType,
          };
        }
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        if (state.messages[conversationId]) {
          state.messages[conversationId].forEach(msg => msg.isRead = true);
        }
        const convIndex = state.conversations.findIndex(c => c._id === conversationId);
        if (convIndex !== -1 && state.conversations[convIndex].lastMessage) {
          state.conversations[convIndex].lastMessage.isRead = true;
        }
      })
      .addCase(editMessageItem.fulfilled, (state, action) => {
         chatSlice.caseReducers.updateMessageLocal(state, action);
      })
      .addCase(deleteMessageGlobal.fulfilled, (state, action) => {
         chatSlice.caseReducers.updateMessageLocal(state, action);
      })
      .addCase(reactToMessageItem.fulfilled, (state, action) => {
         chatSlice.caseReducers.updateMessageLocal(state, action);
      })
      .addCase(deleteMessageMe.fulfilled, (state, action) => {
         chatSlice.caseReducers.removeMessageLocal(state, action);
      })
      .addCase(bulkDeleteForMe.fulfilled, (state, action) => {
         chatSlice.caseReducers.removeMultipleMessagesLocal(state, action);
      });
  },
});

export const { setActiveConversation, receiveMessage, markConversationReadLocal, updateMessageLocal, removeMessageLocal, removeMultipleMessagesLocal } = chatSlice.actions;
export default chatSlice.reducer;
