// components/chat/GroupChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Settings, UserPlus, UserMinus, Trash2, X, Send, Paperclip, Smile } from 'lucide-react';
import Swal from 'sweetalert2';


const GroupChat = ({ 
  groupChats, 
  chat, 
  onSelectChat, 
  formatParticipants, 
  getParticipantCount,
  onCreateGroup,
  onDeleteGroup,
  onAddUser,
  onRemoveUser,
  onSendMessage,
  availableUsers = [],
  messages = [],
  currentUser = null,
  role,
  showCreateGroupModal,
  setShowCreateGroupModal
}) => {

  const [showManageModal, setShowManageModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreateGroup({
        name: newGroupName.trim(),
        participants: [] 
      });
      setNewGroupName('');
      setShowCreateGroupModal(false);
    }
  };

  const handleAddUser = (userId) => {
    if (chat) {
      onAddUser(chat.id, userId);
      setShowAddUserModal(false);
      setSearchTerm(''); 
    }
  };

  const handleRemoveUser = (userId) => {
    if (chat) {
      onRemoveUser(chat.id, userId);
    }
  };



const handleDeleteGroup = async () => {
  if (!chat) return;

  const result = await Swal.fire({
    title: `Delete "${chat.room_name}"?`,
    text: "This action cannot be undone.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    onDeleteGroup(chat.id);
    setShowManageModal(false);

    Swal.fire({
      title: 'Deleted!',
      text: `"${chat.room_name}" has been deleted.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
};


  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || isSending) return;

    setIsSending(true);
    
    try {
      const success = await onSendMessage(trimmedMessage);
      
      if (success !== false) {
        // Only clear the input if sending was successful
        setMessageText('');
        
        // Reset textarea height
        if (messageInputRef.current) {
          messageInputRef.current.style.height = '44px';
        }
      } else {
        
      }
    } catch (error) {
      
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };



  const handleChatSelect = (chatItem) => {
    onSelectChat(chatItem);
  };

  const filteredAvailableUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !chat?.participents?.some(p => p.id === user.id)
  );

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    setSearchTerm('');
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const CreateGroupModal = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Group</h3>
          <button onClick={() => setShowCreateGroupModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Group Name</label>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group name"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
          />
        </div>

        <div className="text-sm text-gray-600 mb-4">
          You can add members after creating the group.
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowCreateGroupModal(false)}
            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );

  const ManageGroupModal = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Group</h3>
          <button onClick={() => setShowManageModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Group: {chat?.room_name}</h4>
          <p className="text-sm text-gray-600 mb-4">{getParticipantCount(chat?.participents)} members</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Members</h4>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
            >
              <UserPlus size={16} className="mr-1" />
              Add User
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto border rounded-md">
            {chat?.participents?.length > 0 ? (
              chat.participents.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                  <div className="flex items-center">
                    <img src={participant.avatar || "/api/placeholder/32/32"} alt={participant.name} className="w-6 h-6 rounded-full mr-2" />
                    <span className="text-sm">{participant.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(participant.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove user from group"
                  >
                    <UserMinus size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No members in this group yet
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleDeleteGroup}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );

  const AddUserModal = () => (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Users to "{chat?.room_name}"</h3>
          <button onClick={closeAddUserModal} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
          />
        </div>

        <div className="max-h-60 overflow-y-auto border rounded-md">
          {filteredAvailableUsers.length > 0 ? (
            filteredAvailableUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                <div className="flex items-center">
                  <img src={user.avatar || "/api/placeholder/32/32"} alt={user.name} className="w-6 h-6 rounded-full mr-2" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={() => handleAddUser(user.id)}
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm ? 'No users found matching your search' : 'No users available to add'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MessageArea = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      {chat && (
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-white font-medium text-sm">
                            {chat.room_name?.charAt(0)?.toUpperCase() || 'G'}
                          </span>
              <div>
                <h3 className="font-medium">{chat.room_name}</h3>
                <p className="text-sm text-gray-500">
                  {getParticipantCount(chat.participents)} members
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="text-blue-500 hover:text-blue-700 p-2"
                title="Add user to group"
              >
                <UserPlus size={20} />
              </button>
              <button
                onClick={() => setShowManageModal(true)}
                className="text-gray-500 hover:text-gray-700 p-2"
                title="Manage group"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat ? (
          <>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.sender?.id=== currentUser|| !message.sender  && role ==="owner"? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender?.id === currentUser  || !message.sender  && role ==="owner"
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {(message.sender?.id !== currentUser || (!message.sender && role === "owner")) && (
                            <p className="text-xs font-medium mb-1 opacity-75">
                                {message.sender || (!message.sender && role === "owner")
                                ? message.sender?.id === currentUser || (!message.sender && role === "owner")
                                    ? "You"
                                    : message.sender?.name
                                : "Owner"}
                            </p>
                            )}

                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender?.id === currentUser || !message.sender  && role ==="owner"? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Select a group chat</p>
              <p className="text-sm">Choose a group to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      {chat && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            

            <div className="flex-1 relative">
              <textarea
                ref={messageInputRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (messageText.trim() && !isSending) {
                      handleSendMessage(e);
                    }
                  }
                }}
                placeholder="Type your message..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px', overflowY: 'auto' }}
                disabled={isSending}
              />
            </div>

            <button
              type="submit"
              disabled={!messageText.trim() || isSending}
              className={`p-3 rounded-lg transition-colors ${
                messageText.trim() && !isSending
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Message Area - Full Width */}
      <MessageArea />

      {/* Modals */}
      {showCreateGroupModal && <CreateGroupModal />}
      {showManageModal && <ManageGroupModal />}
      {showAddUserModal && <AddUserModal />}
    </>
  );
};

export default GroupChat;