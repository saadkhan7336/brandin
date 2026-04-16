import React from "react";
import { X, Search } from "lucide-react";

const ForwardModal = ({ isOpen, onClose, conversations, onForward, user }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!isOpen) return null;

  const getOtherParticipant = (participants) => {
    return participants.find((p) => p._id !== user?._id);
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv.participants);
    return other?.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Forward to...</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border-transparent focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No results found</div>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv.participants);
              return (
                <button
                  key={conv._id}
                  onClick={() => onForward(conv._id)}
                  className="w-full flex items-center p-3 hover:bg-indigo-50 rounded-xl transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden mr-3">
                    {other?.profilePic ? (
                      <img src={other.profilePic} alt="" className="h-full w-full object-cover" />
                    ) : (
                      other?.fullname?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                      {other?.fullname}
                    </p>
                    <p className="text-xs text-gray-500">{other?.role}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
