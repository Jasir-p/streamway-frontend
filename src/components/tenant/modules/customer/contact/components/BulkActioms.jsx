import React from 'react';
import { MoreVertical, Mail, UserPlus, Trash } from 'lucide-react';

const BulkActions = ({ 
  selectedCount, 
  dropdownOpen, 
  setDropdownOpen, 
  onActionClick 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 mr-2 relative">
      <span className="text-sm text-gray-600">{selectedCount} selected</span>
      
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded"
      >
        <MoreVertical size={18} />
      </button>
    
      {dropdownOpen && (
        <div className="absolute top-10 right-0 bg-white rounded shadow-md w-40 z-10">
          <button 
            onClick={() => onActionClick('mass_email')}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            <Mail size={14} className="mr-2" /> Mass Email
          </button>
          <button 
            onClick={() => onActionClick('delete')}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash size={14} className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkActions;