import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const ContactFilters = ({ 
  statusFilter, 
  onStatusFilterChange, 
  showStatusDropdown, 
  setShowStatusDropdown 
}) => {
  const statusOptions = ['All', 'Active', 'Inactive'];

  return (
    <div className="relative inline-block">
      <button 
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
      >
        <Filter size={16} className="text-gray-500" />
        <span>Status: {statusFilter}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      
      {showStatusDropdown && (
        <div className="absolute mt-1 right-0 z-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
          {statusOptions.map(status => (
            <button
              key={status}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => {
                onStatusFilterChange(status);
                setShowStatusDropdown(false);
              }}
            >
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactFilters;