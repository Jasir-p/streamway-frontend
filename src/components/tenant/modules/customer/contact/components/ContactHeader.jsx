import React from 'react';
import { Download, UserPlus } from 'lucide-react';

const ContactHeader = ({ onAddContact }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
        <p className="text-gray-500 mt-1">Manage your contacts and leads</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
          <Download size={16} />
          Export
        </button>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={onAddContact}
        >
          <UserPlus size={16} />
          Add Contact
        </button>
      </div>
    </div>
  );
};

export default ContactHeader;