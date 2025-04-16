import React, { useState } from 'react';

const STATUS_OPTIONS = {
  lead: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'],
  task: ['Pending', 'In Progress', 'Completed', 'On Hold'],
  // Add more sections if needed
};

const StatusDropdown = ({ type, leads }) => {
  const [open, setOpen] = useState(false);
  const options = STATUS_OPTIONS[type] || [];

  const handleSelect = (status) => {
    setOpen(false);
    console.log(leads);
     // Send back selected status
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium flex items-center"
      >
        <span className="mr-2">Update Status</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-md z-10">

          {options.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
