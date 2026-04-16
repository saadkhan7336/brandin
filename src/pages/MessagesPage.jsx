import React from 'react';
import ChatLayout from '../components/chat/ChatLayout';

const MessagesPage = () => {
  return (
    <div className="h-full flex flex-col w-full h-[calc(100vh-80px)] overflow-hidden">
      <div className="flex-1 min-h-0 h-full">
        <ChatLayout />
      </div>
    </div>
  );
};

export default MessagesPage;
