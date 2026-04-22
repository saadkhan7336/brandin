import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setActiveConversation,
  receiveMessage,
  markMessagesAsRead,
  markConversationReadLocal,
  uploadAttachment,
  updateMessageLocal,
  removeMessageLocal,
  editMessageItem,
  reactToMessageItem,
  deleteMessageMe,
  deleteMessageGlobal,
  bulkDeleteForMe
} from "../../redux/slices/chatSlice";
import { updateUserPresence } from "../../redux/slices/presenceSlice";
import MessageBubble from "./MessageBubble";
import ForwardModal from "./ForwardModal";
import { io } from "socket.io-client";
import { Send, Menu, Phone, Video, MoreVertical, Paperclip, ImageIcon, Check, CheckCheck, Smile, Search, X, Forward, Trash2, MessageCircle, Target, FileText } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import EmojiPicker from 'emoji-picker-react';
import collaborationService from "../../services/collaborationService";
import VerifiedTick from "../common/VerifiedTick";

const ENDPOINT = process.env.REACT_APP_API_URL || "http://localhost:8000";

const ChatLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { conversations, messages, activeConversation, loading } = useSelector(
    (state) => state.chat
  );
  const presenceUsers = useSelector((state) => state.presence.users);

  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Advanced feature tracking states
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const allFileInputRef = useRef(null);
  
  // Real-time UI states
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      withCredentials: true,
    });
    setSocket(newSocket);

    if (user) {
      newSocket.on("connect", () => {
        console.log("Socket Connected! ID:", newSocket.id);
        newSocket.emit("setup", user);
      });

      newSocket.on("message recieved", (newMessageRecieved) => {
        dispatch(receiveMessage(newMessageRecieved));
      });
      newSocket.on("messages read", ({ conversationId, readBy }) => {
        dispatch(markConversationReadLocal(conversationId));
      });
      
      // Fallback handlers if backend supports these realtime custom broadcasts
      newSocket.on("message updated", (updatedMsg) => {
         dispatch(updateMessageLocal(updatedMsg));
      });
      newSocket.on("message deleted", ({ messageId, conversationId }) => {
         dispatch(removeMessageLocal({ messageId, conversationId }));
      });
      
      newSocket.on("user_status_changed", (data) => {
        dispatch(updateUserPresence(data));
      });

      newSocket.on("typing", (room) => {
        if (activeConversation?._id === room) {
           setIsTyping(true);
        }
      });

      newSocket.on("stop typing", (room) => {
        if (activeConversation?._id === room) {
           setIsTyping(false);
        }
      });

      // Handle re-setup on manual reconnection event if needed by socket.io
      newSocket.on("reconnect", () => {
         newSocket.emit("setup", user);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.off("message recieved");
        newSocket.off("messages read");
        newSocket.off("message updated");
        newSocket.off("message deleted");
        newSocket.off("user_status_changed");
        newSocket.off("typing");
        newSocket.off("stop typing");
        newSocket.disconnect();
      }
    };
  }, [user, dispatch, activeConversation?._id]);

  useEffect(() => {
    if (activeConversation) {
      dispatch(fetchMessages(activeConversation._id)).then(() => {
        // If there are unread messages, let's mark them as read
        const isUnread = activeConversation.lastMessage && !activeConversation.lastMessage.isRead && 
                         String(activeConversation.lastMessage.sender?._id || activeConversation.lastMessage.sender) !== String(user?._id);
        
        if (isUnread) {
          dispatch(markMessagesAsRead(activeConversation._id));
        }

        if (socket) {
          if (isUnread) {
             socket.emit("mark as read", { conversationId: activeConversation._id, userId: user._id });
          }
          socket.emit("join chat", activeConversation._id);
        }
      });
    }
  }, [activeConversation, dispatch, socket, user]);

  // Dynamic Collab Data
  const [activeCollaboration, setActiveCollaborationData] = useState(null);
  const [fetchingCollab, setFetchingCollab] = useState(false);

  useEffect(() => {
    const fetchCollabData = async () => {
      setFetchingCollab(true);
      try {
        let collabData = null;
        
        // 1. Try explicit link first
        if (activeConversation?.collaboration) {
          const collabId = activeConversation.collaboration._id || activeConversation.collaboration;
          const res = await collaborationService.getOne(collabId);
          collabData = res.data;
        } 
        
        // 2. Fallback: Search by participants if no explicit link exists (for old conversations)
        if (!collabData && activeConversation) {
          const otherUser = getOtherParticipant(activeConversation.participants);
          if (otherUser) {
            const res = await collaborationService.getLatestWithUser(otherUser._id);
            collabData = res.data;
          }
        }
        
        setActiveCollaborationData(collabData);
      } catch (error) {
        console.error("Error fetching collab details:", error);
        setActiveCollaborationData(null);
      } finally {
        setFetchingCollab(false);
      }
    };

    if (activeConversation) {
      fetchCollabData();
    } else {
      setActiveCollaborationData(null);
    }
  }, [activeConversation]);

  useEffect(() => {
    // Scroll to bottom when messages change without shifting the whole page
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

    // Auto-seen logic for actively open conversations
    if (!activeConversation || !socket || !user) return;
    
    const activeMessages = messages[activeConversation._id];
    if (activeMessages && activeMessages.length > 0) {
      const lastMsg = activeMessages[activeMessages.length - 1];
      
      // If the newest message in the active chat is unread and it's NOT from us
      if (!lastMsg.isRead && String(lastMsg.sender?._id || lastMsg.sender) !== String(user._id)) {
        
        // Dispatch backend read status
        dispatch(markMessagesAsRead(activeConversation._id));
        
        // Immediately notify the sender via socket so they see the blue ticks right away
        socket.emit("mark as read", { conversationId: activeConversation._id, userId: user._id });
        
        // Also update locally to clear any UI unread local dots instantly
        dispatch(markConversationReadLocal(activeConversation._id));
      }
    }
  }, [messages, activeConversation]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    if (editingMessage) {
      const action = await dispatch(editMessageItem({ messageId: editingMessage._id, text: newMessage }));
      if (editMessageItem.fulfilled.match(action)) {
         if (socket) socket.emit("message updated", action.payload);
      }
      setEditingMessage(null);
      setNewMessage("");
      return;
    }

    const action = await dispatch(
      sendMessage({
        conversationId: activeConversation._id,
        text: newMessage,
        replyTo: replyingToMessage?._id || null
      })
    );

    if (sendMessage.fulfilled.match(action)) {
      setNewMessage("");
      setReplyingToMessage(null);
      if (socket) {
        socket.emit("new message", action.payload);
      }
    }
  };

  const cancelContext = () => {
    setEditingMessage(null);
    setReplyingToMessage(null);
    setNewMessage("");
  };

  // Handlers mapped directly to Bubbles
  const onReply = (msg) => {
    setReplyingToMessage(msg);
    setEditingMessage(null);
  };
  const onEdit = (msg) => {
    setEditingMessage(msg);
    setReplyingToMessage(null);
    setNewMessage(msg.text);
  };
  const onDeleteMe = async (messageId) => {
    await dispatch(deleteMessageMe({ messageId, conversationId: activeConversation._id }));
  };
  const onDeleteEveryone = async (messageId) => {
    const action = await dispatch(deleteMessageGlobal(messageId));
    if (deleteMessageGlobal.fulfilled.match(action) && socket) {
        socket.emit("message updated", action.payload);
    }
  };
  const onReact = async (messageId, emoji) => {
    const action = await dispatch(reactToMessageItem({ messageId, emoji }));
    if (reactToMessageItem.fulfilled.match(action) && socket) {
        socket.emit("message updated", action.payload);
    }
  };
  const onSelect = (messageId) => {
    setSelectMode(true);
    const activeMessages = messages[activeConversation._id] || [];
    const msg = activeMessages.find(m => m._id === messageId);
    if (!msg) return;

    setSelectedMessageIds(prev => 
      prev.includes(messageId) ? prev.filter(id => id !== messageId) : [...prev, messageId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedMessageIds.length === 0) return;
    if (window.confirm(`Delete ${selectedMessageIds.length} messages for you?`)) {
      await dispatch(bulkDeleteForMe({ messageIds: selectedMessageIds, conversationId: activeConversation._id }));
      setSelectMode(false);
      setSelectedMessageIds([]);
    }
  };

  const handleForwardMessages = async (targetConversationId) => {
    const messagesToForward = messages[activeConversation._id].filter(m => selectedMessageIds.includes(m._id));
    
    for (const msg of messagesToForward) {
       await dispatch(sendMessage({
          conversationId: targetConversationId,
          text: msg.text,
          attachmentUrl: msg.attachmentUrl,
          attachmentType: msg.attachmentType
       }));
       // In a real app we might want a bulk forward thunk, but this works for perfect cloning
    }
    
    setIsForwardModalOpen(false);
    setSelectMode(false);
    setSelectedMessageIds([]);
    alert(`Forwarded ${messagesToForward.length} messages!`);
  };

  const handleGenericFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;

    if (file.size > 3 * 1024 * 1024) {
       alert("File is too large! Maximum size is 3MB.");
       return;
    }

    setIsUploading(true);
    const resultAction = await dispatch(uploadAttachment(file));
    setIsUploading(false);
    
    if (uploadAttachment.fulfilled.match(resultAction)) {
      const { url } = resultAction.payload;
      
      let fileType = "raw";
      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";

      const sendAction = await dispatch(
        sendMessage({
          conversationId: activeConversation._id,
          text: "",
          attachmentUrl: url,
          attachmentType: fileType,
        })
      );

      if (sendMessage.fulfilled.match(sendAction)) {
        if (socket) socket.emit("new message", sendAction.payload);
      }
    }
  };

  // Monitor select mode escaping if selection array empties safely
  useEffect(() => {
     if (selectMode && selectedMessageIds.length === 0) setSelectMode(false);
  }, [selectMode, selectedMessageIds]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;

    setIsUploading(true);
    const resultAction = await dispatch(uploadAttachment(file));
    setIsUploading(false);
    
    if (uploadAttachment.fulfilled.match(resultAction)) {
      const { url } = resultAction.payload;
      
      const fileType = file.type.startsWith("video/") 
          ? "video" 
          : file.type.startsWith("image/") ? "image" : "raw";

      const sendAction = await dispatch(
        sendMessage({
          conversationId: activeConversation._id,
          text: "",
          attachmentUrl: url,
          attachmentType: fileType,
          replyTo: replyingToMessage?._id || null
        })
      );

      if (sendMessage.fulfilled.match(sendAction)) {
        setReplyingToMessage(null);
        if (socket) {
          socket.emit("new message", sendAction.payload);
        }
      }
    }
  };

  const getOtherParticipant = (participants) => {
    if (!participants) return null;
    return participants.find((p) => p._id !== user?._id);
  };

  return (
    <div className="flex bg-white overflow-hidden w-full h-full">
      {/* Sidebar - Conversation List */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Messages</h2>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-0.5 py-2">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-40 space-y-3">
               <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
               <span className="text-sm text-gray-400 font-medium">Loading chats...</span>
             </div>
          ) : conversations?.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          ) : (
            conversations.filter((conv) => {
              const u = getOtherParticipant(conv.participants);
              return u && u.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
            }).map((conv) => {
              const otherUser = getOtherParticipant(conv.participants);
              const isActive = activeConversation?._id === conv._id;
              const isUnread = conv.lastMessage && !conv.lastMessage.isRead && 
                                String(conv.lastMessage.sender?._id || conv.lastMessage.sender) !== String(user?._id);
              
              const fallbackPresence = otherUser ? { status: otherUser.status, lastActive: otherUser.lastActive } : null;
              const otherUserPresence = otherUser ? (presenceUsers[otherUser._id] || fallbackPresence) : null;
              const isOnline = otherUserPresence?.status === "active";

              return (
                <div
                  key={conv._id}
                  onClick={() => dispatch(setActiveConversation(conv))}
                  className={`group flex items-center px-4 py-3 mx-2 rounded-2xl cursor-pointer transition-all ${
                    isActive ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center shadow-sm">
                      {otherUser?.profilePic ? (
                        <img src={otherUser.profilePic} alt="pic" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <span className="text-indigo-700 font-bold text-lg">{otherUser?.fullname?.charAt(0)}</span>
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className={`text-sm font-semibold flex items-center gap-1 truncate ${isActive ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {otherUser?.fullname || "Unknown User"}
                        <VerifiedTick user={otherUser} size="xs" />
                      </h3>
                      {conv.lastMessage?.createdAt && (
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false }).replace('about ', '')}
                        </span>
                      )}
                    </div>
                    
                    {/* Campaign Badge - DYNAMIC */}
                    {conv.campaign?.name && (
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        isActive ? 'bg-white text-indigo-600 shadow-sm' : 'bg-indigo-50 text-indigo-500'
                      }`}>
                        {conv.campaign.name}
                      </div>
                    )}

                    <p className={`text-xs truncate ${isUnread ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                      {conv.lastMessage?.text || "New conversation started"}
                    </p>
                  </div>
                  {isUnread && (
                    <div className="ml-2 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-4 ring-white shadow-sm"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeConversation ? (
          (() => {
             const chatOtherUser = getOtherParticipant(activeConversation.participants);
             const fallbackPresence = chatOtherUser ? { status: chatOtherUser.status, lastActive: chatOtherUser.lastActive } : null;
             const chatOtherUserPresence = chatOtherUser ? (presenceUsers[chatOtherUser._id] || fallbackPresence) : null;
             
             const isOnline = chatOtherUserPresence?.status === "active";
             const lastActiveText = chatOtherUserPresence?.lastActive ? `Active ${formatDistanceToNow(new Date(chatOtherUserPresence.lastActive), { addSuffix: true })}` : "Offline";

             return (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0 transition-all">
               {selectMode ? (
                 <div className="flex w-full items-center justify-between animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center space-x-3">
                       <button onClick={() => { setSelectMode(false); setSelectedMessageIds([]); }} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
                         <X className="w-5 h-5" />
                       </button>
                       <h3 className="text-md font-bold text-gray-800">{selectedMessageIds.length} Selected</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                       <button 
                         className="flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-sm font-semibold transition-all" 
                         onClick={() => setIsForwardModalOpen(true)}
                       >
                         <Forward className="w-4 h-4 mr-2" /> Forward
                       </button>
                       <button 
                         className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all" 
                         onClick={handleBulkDelete}
                       >
                         <Trash2 className="w-4 h-4 mr-2" /> Delete
                       </button>
                    </div>
                 </div>
               ) : (
                <>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-11 w-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold overflow-hidden shadow-sm">
                      {chatOtherUser?.profilePic ? 
                          <img className="h-full w-full object-cover" src={chatOtherUser?.profilePic} alt="" /> 
                          : <span>{chatOtherUser?.fullname?.charAt(0)}</span>}
                    </div>
                    {isOnline && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full ring-2 ring-transparent transition-all"></span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-gray-900 leading-none">
                        {chatOtherUser?.fullname}
                      </h3>
                      <VerifiedTick user={chatOtherUser} size="xs" />
                    </div>
                    <div className={`flex items-center gap-1.5 ${isTyping ? 'animate-pulse' : ''}`}>
                       <span className="text-xs font-medium text-gray-400">
                          {isTyping ? "Typing..." : (isOnline ? "Online" : lastActiveText)}
                       </span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                     <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                     <Video className="w-5 h-5" />
                  </button>
                  <div className="w-px h-6 bg-gray-100 mx-2"></div>
                   <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                     <MoreVertical className="w-5 h-5" />
                   </button>
                </div>
                </>
               )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-6 bg-[#FAFBFF] relative">
              {messages[activeConversation._id]?.map((msg, index, arr) => {
                const prevMsg = arr[index - 1];
                const showAvatar = !prevMsg || prevMsg.sender._id !== msg.sender._id || prevMsg.sender !== msg.sender;
                
                return (
                  <MessageBubble
                    key={msg._id || index}
                    message={msg}
                    isOwnMessage={msg.sender._id === user?._id || msg.sender === user?._id}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDeleteMe={onDeleteMe}
                    onDeleteEveryone={onDeleteEveryone}
                    onReact={onReact}
                    onSelect={onSelect}
                    selectMode={selectMode}
                    isSelected={selectedMessageIds.includes(msg._id)}
                    showAvatar={showAvatar}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              {(editingMessage || replyingToMessage) && (
                 <div className="w-full bg-indigo-50/50 border-l-4 border-indigo-500 px-4 py-3 mb-4 rounded-xl flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                        {editingMessage ? 'Editing Message' : `Replying to ${replyingToMessage.sender?.fullname || 'User'}`}
                      </span>
                      <p className="text-sm text-gray-600 truncate italic">
                        {editingMessage?.text || replyingToMessage?.text || "Shared Attachment"}
                      </p>
                    </div>
                    <button type="button" onClick={cancelContext} className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-500 transition-colors">
                       <X className="w-4 h-4" />
                    </button>
                 </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex gap-1">
                  <input type="file" ref={allFileInputRef} onChange={handleGenericFileUpload} className="hidden" />
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,video/*" />
                  
                  <button 
                    type="button" 
                    onClick={() => allFileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                    title="Attach File"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                    title="Attach Media"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 relative bg-gray-50 rounded-2xl border border-transparent focus-within:border-indigo-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                  <div className="flex items-center pr-2">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                      className="p-3 text-gray-400 hover:text-indigo-500 transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <textarea
                      rows="1"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        if (socket && activeConversation) {
                          socket.emit("typing", activeConversation._id);
                          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                          typingTimeoutRef.current = setTimeout(() => {
                            socket.emit("stop typing", activeConversation._id);
                          }, 3000);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Message ${chatOtherUser?.fullname?.split(' ')[0]}...`}
                      className="w-full bg-transparent py-3.5 px-1 focus:outline-none text-sm resize-none"
                    />
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 left-0 z-50">
                      <EmojiPicker 
                        onEmojiClick={(emojiData) => {
                          setNewMessage((prev) => prev + emojiData.emoji);
                          setShowEmojiPicker(false);
                        }} 
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white rounded-2xl p-4 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
          );
        })()
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFBFF]">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your Inbox</h2>
            <p className="text-sm text-gray-400 max-w-xs text-center">Select a conversation from the left to start messaging your partners.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Profile & Campaign Details */}
      {activeConversation && (
        <div className="w-80 bg-white border-l border-gray-100 overflow-y-auto hidden xl:flex flex-col">
          {(() => {
             const chatOtherUser = getOtherParticipant(activeConversation.participants);
             const stats = activeCollaboration?.influencerStats || { followersCount: '1.2M', engagementRate: '4.8%' };
             const currentCampaign = activeCollaboration?.campaign || activeConversation.campaign;
             const deliverables = activeCollaboration?.deliverables || [];
             const completedCount = deliverables.filter(d => d.status === 'approved').length;
             const totalCount = deliverables.length || 4;
             const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
             
             return (
               <>
                 <div className="p-8 flex flex-col items-center text-center border-b border-gray-50">
                    <div className="w-24 h-24 rounded-3xl bg-indigo-50 overflow-hidden mb-4 shadow-xl shadow-indigo-100 ring-4 ring-white">
                      {chatOtherUser?.profilePic ? (
                        <img src={chatOtherUser.profilePic} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-300">
                          {chatOtherUser?.fullname?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1 justify-center">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{chatOtherUser?.fullname}</h3>
                      <VerifiedTick user={chatOtherUser} size="xs" />
                    </div>
                    <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-[0.2em] mb-3">
                      {chatOtherUser?.role === 'brand' ? 'Brand Partner' : 'Influencer'}
                    </p>
                    <button 
                      onClick={() => {
                        const targetUrl = chatOtherUser?.role === 'brand' 
                          ? `/influencer/search/brand/${chatOtherUser?._id}`
                          : `/brand/influencer/${chatOtherUser?._id}`;
                        navigate(targetUrl);
                      }}
                      className="px-6 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-100"
                    >
                      View {chatOtherUser?.role === 'brand' ? 'Brand' : 'Influencer'} Profile
                    </button>
                    
                    <div className="flex items-center gap-6 mt-6 w-full justify-center">
                       <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {typeof stats.followersCount === 'number' ? 
                              (stats.followersCount >= 1000000 ? (stats.followersCount/1000000).toFixed(1) + 'M' : 
                               (stats.followersCount >= 1000 ? (stats.followersCount/1000).toFixed(1) + 'K' : stats.followersCount)) 
                              : stats.followersCount}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Followers</p>
                       </div>
                       <div className="w-px h-8 bg-gray-100"></div>
                       <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{stats.engagementRate}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Eng. Rate</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Current Campaign</h4>
                      {currentCampaign ? (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-100 transition-colors">
                           <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
                                {currentCampaign.image ? <img src={currentCampaign.image} alt="c" className="w-full h-full object-cover" /> : <Target className="w-5 h-5 text-indigo-500" />}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-sm font-bold text-gray-900 truncate">{currentCampaign.name}</p>
                                 <p className="text-[10px] font-medium text-gray-400">
                                   {currentCampaign.endDate ? `Ends ${format(new Date(currentCampaign.endDate), 'MMM dd, yyyy')}` : 'Ongoing'}
                                 </p>
                              </div>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-bold">
                               <span className="text-gray-500 uppercase">Deliverables</span>
                               <span className="text-indigo-600">{completedCount} / {totalCount}</span>
                             </div>
                             <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                             </div>
                           </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                          <p className="text-xs text-gray-400 font-medium leading-relaxed">Select a collaboration from the requests page to see campaign details here.</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Quick Links</h4>
                      <div className="space-y-2">
                        {[
                          { icon: FileText, label: 'Signed Contract' },
                          { icon: Paperclip, label: 'Performance Stats' }
                        ].map((link, i) => (
                          <button key={i} className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <link.icon className="w-4 h-4 text-gray-500" />
                              </div>
                              <span className="text-xs font-bold text-gray-700">{link.label}</span>
                            </div>
                            <Forward className="w-3 h-3 text-gray-300" />
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
               </>
             )
          })()}
        </div>
      )}

      <ForwardModal 
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        conversations={conversations}
        onForward={handleForwardMessages}
        user={user}
      />
    </div>
  );
};

export default ChatLayout;
