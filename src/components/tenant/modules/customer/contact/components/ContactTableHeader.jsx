import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const ContactTableHeader = ({ 
  sortBy, 
  onSort, 
  selectedContacts, 
  filteredContacts, 
  onToggleSelectAll 
}) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded"
              checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
              onChange={onToggleSelectAll}
            />
          </div>
        </th>
        <th className="px-4 py-3">
          <button 
            className="flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            onClick={() => onSort('name')}
          >
            Name
            {sortBy === 'name' && (
              <ArrowUpDown size={14} className="ml-1 text-gray-400" />
            )}
          </button>
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Contact Info
        </th>
        <th className="px-4 py-3">
          <button 
            className="flex items-center text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            onClick={() => onSort('status')}
          >
            Status
            {sortBy === 'status' && (
              <ArrowUpDown size={14} className="ml-1 text-gray-400" />
            )}
          </button>
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Owner
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Account
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Last Contact
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default ContactTableHeader;