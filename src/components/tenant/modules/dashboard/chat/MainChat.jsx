// components/chat/MainChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Phone, MessageSquare, Users, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const MainChat = ({ 
  onCreateGroup,
  availableUsers
}) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const userID = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const groupData = {
      name: groupName.trim(),
      participants: selectedUsers
    };

    const success = await onCreateGroup(groupData);
    if (success) {
      setGroupName('');
      setSelectedUsers([]);
      setShowCreateGroup(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={40} className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Chat</h3>
          <p className="text-gray-600">Select a conversation from the sidebar to start messaging, or create a new group chat.</p>
        </div>

        {!showCreateGroup ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus size={20} className="mr-2" />
              Create New Group
            </button>
            
            <div className="text-sm text-gray-500">
              <p>💡 Tips:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Click on any chat in the sidebar to start messaging</li>
                <li>• Create groups to chat with multiple people</li>
                <li>• Use the search bar to find specific conversations</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Create New Group</h4>
            
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {availableUsers && availableUsers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Members (Optional)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                    {availableUsers.map((user) => (
                      <div 
                        key={user.id}
                        className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <label 
                            htmlFor={`user-${user.id}`}
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {user.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedUsers.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateGroup(false);
                    setGroupName('');
                    setSelectedUsers([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim()}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors font-medium ${
                    groupName.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainChat;