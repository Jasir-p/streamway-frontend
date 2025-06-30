// components/chat/PersonalChat.jsx
import React from 'react';

const PersonalChat = ({ personalChats, activeChat, onSelectChat }) => {
  return (
    <div className="overflow-y-auto h-full pb-20">
      {personalChats?.length > 0 ? (
        personalChats.map(chat => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${activeChat?.id === chat.id ? 'bg-blue-50' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="relative">
              <img src={chat.avatar || "/api/placeholder/40/40"} alt={chat.name} className="w-10 h-10 rounded-full" />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              {chat.unread > 0 && (
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No personal chats found</div>
      )}
    </div>
  );
};

export default PersonalChat;