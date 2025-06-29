import React, { useState, useEffect } from 'react';


const UserDropdown = ({ 
  value, 
  onChange, 
  isTeam = false, 

  employees = [],
  placeholder="Change assigned" ,
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get the appropriate user list based on isTeam flag

  console.log(employees);
  
  // Filter users based on search term
  const filteredUsers = employees?.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected user
  const selectedUser = employees?.find(user => user.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user) => {
    onChange(user.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div className={`user-dropdown relative ${className}`}>
      <div
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          cursor-pointer bg-white text-sm
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedUser ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <span>{selectedUser.name}</span>
                {selectedUser.role && (
                  <span className="text-gray-500 text-xs">({selectedUser.role.name})</span>
                )}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {selectedUser && !disabled && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-1"
                type="button"
              >
                ✕
              </button>
            )}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={`Search ${isTeam ? 'team members' : 'employees'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* User List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`
                    px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2
                    ${selectedUser?.id === user.id ? 'bg-indigo-50 text-indigo-700' : ''}
                  `}
                  onClick={() => handleSelect(user)}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    {user.email && (
                      <div className="text-xs text-gray-500">{user.email}</div>
                    )}
                    {user.role && (
                      <div className="text-xs text-gray-500">{user.role.name}</div>
                    )}
                  </div>
                  {selectedUser?.id === user.id && (
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No {isTeam ? 'team members' : 'employees'} found
              </div>
            )}
          </div>

          {/* Add "Unassigned" option */}
          <div className="border-t border-gray-200">
            <div
              className={`
                px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm
                ${!selectedUser ? 'bg-indigo-50 text-indigo-700' : ''}
              `}
              onClick={() => handleSelect({ id: null, name: 'Unassigned' })}
            >
              <div className="flex items-center justify-between">
                <span>Unassigned</span>
                {!selectedUser && (
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;