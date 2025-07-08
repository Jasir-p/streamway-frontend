// components/chat/CreateGroupPage.jsx
import React, { useState } from 'react';
import { ArrowLeft, Users, Plus, Check } from 'lucide-react';
import { useSelector } from 'react-redux';

const CreateGroupPage = ({ 
  onCreateGroup,
  availableUsers,
  onBack
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const userID = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsCreating(true);
    
    const groupData = {
      name: groupName.trim(),
      participants: selectedUsers
    };

    const success = await onCreateGroup(groupData);
    if (success) {
      setGroupName('');
      setSelectedUsers([]);
      onBack && onBack();
    }
    
    setIsCreating(false);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Create New Group</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleCreateGroup} className="space-y-6">
              {/* Group Name Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Choose a name that describes your group's purpose
                </p>
              </div>

              {/* Members Section */}
              {availableUsers && availableUsers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Add Members (Optional)
                  </label>
                  
                  {selectedUsers.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Check size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          {selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <div 
                        key={user.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <label 
                                htmlFor={`user-${user.id}`}
                                className="text-sm font-medium text-gray-900 cursor-pointer block"
                              >
                                {user.name}
                              </label>
                              {user.email && (
                                <p className="text-xs text-gray-500">{user.email}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    You can add more members later from the group settings
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim() || isCreating}
                  className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${
                    groupName.trim() && !isCreating
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Plus size={16} />
                      <span>Create Group</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Group Chat Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Groups can have up to 256 members</li>
            <li>• You can add or remove members anytime</li>
            <li>• Group admins can manage settings and permissions</li>
            <li>• Use @mentions to notify specific members</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;