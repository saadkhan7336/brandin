import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { Check, CheckCheck, ChevronDown, Reply, Edit2, Copy, Trash2, Smile, CheckSquare } from "lucide-react";

const MessageBubble = ({ message, isOwnMessage, onReply, onEdit, onDeleteMe, onDeleteEveryone, onReact, onSelect, isSelected, selectMode, showAvatar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const isEmojiOnly = (text) => {
    if (!text) return false;
    const stripped = text.replace(/[\s\n\u200d\ufe0f]/g, '');
    if (stripped.length === 0) return false;
    return /^[\p{Extended_Pictographic}\p{Emoji_Component}]+$/u.test(stripped);
  };

  const emojiOnly = isEmojiOnly(message.text) && !message.attachmentUrl;

  // If this message was globally deleted, block all render payload and menus
  const isDeleted = message.isDeletedForEveryone;

  return (
    <div
      className={clsx(
        "flex w-full mt-2" + (showAvatar ? " mt-4" : " mt-0.5"),
        "space-x-3 max-w-lg relative group transition-all",
        isOwnMessage ? "ml-auto justify-end" : "",
        isSelected ? "bg-indigo-50/50 p-2 rounded-xl" : "",
        selectMode ? "pl-8" : "" // give space for checkbox if in bulk select mode
      )}
    >
      {/* Bulk Select Checkbox overlay */}
      {selectMode && (
        <div 
          className="absolute left-1 top-1/2 -translate-y-1/2 cursor-pointer z-10" 
          onClick={() => onSelect(message._id)}
        >
           <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 hover:border-indigo-400'}`}>
              {isSelected && <Check className="w-3 h-3" />}
           </div>
        </div>
      )}
      {!isOwnMessage && (
        <div className="flex-shrink-0 w-10">
          {showAvatar ? (
            <div className="h-10 w-10 rounded-xl bg-indigo-100 overflow-hidden flex items-center justify-center font-bold text-indigo-800 shadow-sm border border-white">
              {message.sender?.profilePic ? (
                <img
                  src={message.sender.profilePic}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{message.sender?.fullname?.charAt(0) || "U"}</span>
              )}
            </div>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="relative group/bubble flex items-center">
          {/* Context Menu chevron visible on bubble hover */}
          {!isDeleted && isOwnMessage && (
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="mr-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover/bubble:opacity-100 transition-opacity focus:opacity-100"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          <div
            className={clsx(
              "rounded-2xl inline-block flex flex-col relative",
              isDeleted 
                ? "p-3 shadow-sm bg-gray-100 italic text-gray-500 border border-gray-200" 
                : emojiOnly
                  ? "bg-transparent text-4xl shadow-none p-0"
                  : isOwnMessage
                    ? "p-3 shadow-sm bg-[#0084FF] text-white rounded-tr-sm text-sm"
                    : "p-3 shadow-sm bg-white border border-gray-200 text-gray-800 rounded-tl-sm text-sm"
            )}
          >
            {message.replyTo && !isDeleted && (
               <div className="mb-2 p-2 bg-black/10 rounded border-l-4 border-black/20 text-xs italic opacity-80 cursor-pointer line-clamp-1">
                  {message.replyTo.text || "Attachment"}
               </div>
            )}
            {isDeleted ? (
                <p>This message was deleted.</p>
            ) : (
              <>
                {message.attachmentUrl && (
                  <div className="mb-2">
                    {message.attachmentType === "image" ? (
                      <img
                        src={message.attachmentUrl}
                        alt="Attachment"
                        className="max-w-[240px] max-h-64 rounded-lg object-contain cursor-pointer"
                        onClick={() => window.open(message.attachmentUrl, "_blank")}
                      />
                    ) : message.attachmentType === "video" ? (
                      <video controls className="max-w-[240px] max-h-64 rounded-lg">
                        <source src={message.attachmentUrl} />
                      </video>
                    ) : (
                      <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className="underline break-all">
                        View Attachment
                      </a>
                    )}
                  </div>
                )}
                {message.text && <p>{message.text}</p>}
              </>
            )}
          </div>

          {!isDeleted && !isOwnMessage && (
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover/bubble:opacity-100 transition-opacity focus:opacity-100"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* The Dropdown Menu Map */}
          {showMenu && !isDeleted && (
             <div 
               ref={menuRef}
               className={`absolute top-8 ${isOwnMessage ? 'right-6' : 'left-[100px]'} w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden text-sm font-medium`}
             >
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-gray-700" onClick={() => { onReply(message); setShowMenu(false); }}>
                  <Reply className="w-4 h-4 mr-2" /> Reply
                </button>
                
                <div 
                   className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col relative group/react"
                >
                    <div className="flex items-center text-gray-700" onClick={() => setShowReactions(!showReactions)}>
                      <Smile className="w-4 h-4 mr-2" /> React...
                    </div>
                    {showReactions && (
                      <div className="flex bg-gray-100 rounded-lg p-1 space-x-1 mt-2 justify-between cursor-default">
                         {["👍","❤️","😂","😯","😢"].map(emoji => (
                           <span key={emoji} className="cursor-pointer hover:scale-125 transition-transform" onClick={(e) => { e.stopPropagation(); onReact(message._id, emoji); setShowMenu(false); setShowReactions(false); }}>{emoji}</span>
                         ))}
                      </div>
                    )}
                </div>

                {!selectMode && (
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-gray-700" onClick={() => { onSelect(message._id); setShowMenu(false); }}>
                    <CheckSquare className="w-4 h-4 mr-2" /> Select
                  </button>
                )}
                
                {message.attachmentUrl && message.attachmentType === "image" && (
                   <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-gray-700" onClick={() => { navigator.clipboard.writeText(message.attachmentUrl); setShowMenu(false); alert("Image link copied to clipboard!"); }}>
                     <Copy className="w-4 h-4 mr-2" /> Copy Image Link
                   </button>
                )}

                {isOwnMessage && (
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-gray-700" onClick={() => { onEdit(message); setShowMenu(false); }}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </button>
                )}

                <hr className="border-gray-100" />
                <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center" onClick={() => { onDeleteMe(message._id); setShowMenu(false); }}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete for me
                </button>
                {isOwnMessage && (
                  <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center" onClick={() => { onDeleteEveryone(message._id); setShowMenu(false); }}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete for everyone
                  </button>
                )}
             </div>
          )}
        </div>
        
        <div className={clsx("flex items-center gap-1 mt-1 text-xs text-gray-400 font-medium", isOwnMessage ? "justify-end" : "justify-start")}>
          {message.isEdited && <span className="italic mr-1 text-gray-300">Edited</span>}
          <span>{format(new Date(message.createdAt), "HH:mm")}</span>
          {isOwnMessage && !isDeleted && (
             message.isRead ? 
               <CheckCheck className="w-4 h-4 text-[#0084FF]" /> : 
               <CheckCheck className="w-4 h-4" />
          )}
        </div>
        
        {/* Render Reactions */}
        {!isDeleted && message.reactions && message.reactions.length > 0 && (
           <div className={clsx("flex flex-wrap gap-1 mt-1", isOwnMessage ? "justify-end" : "justify-start")}>
              {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
                 const count = message.reactions.filter(r => r.emoji === emoji).length;
                 return (
                   <div key={emoji} className="bg-white border hover:bg-gray-50 cursor-pointer border-gray-200 rounded-full px-2 py-0.5 text-xs flex items-center shadow-sm">
                      <span>{emoji}</span> {count > 1 && <span className="ml-1 text-gray-500 font-bold">{count}</span>}
                   </div>
                 )
              })}
           </div>
        )}
      </div>
      
    </div>
  );
};

export default MessageBubble;
