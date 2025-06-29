import React from 'react';

export const ActionButton = ({ icon: Icon, color = "gray", onClick, disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`p-1 text-gray-600 hover:text-${color}-600 hover:bg-${color}-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <Icon className="w-4 h-4" />
  </button>
);

