import React, { useRef } from 'react';
import { X, AlertTriangle, Mail, UserPlus, Trash } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  actionType, 
  onConfirm, 
  onCancel 
}) => {
  const confirmationRef = useRef(null);

  const actionConfigs = {
    mass_email: {
      title: "Send Mass Email",
      message: "Are you sure you want to send an email to the selected contacts?",
      icon: <Mail size={18} className="text-blue-500" />
    },
    delete: {
      title: "Delete Contacts",
      message: "Are you sure you want to delete the selected contacts? This action cannot be undone.",
      icon: <Trash size={18} className="text-red-500" />
    }
  };

  if (!isOpen || !actionType) return null;

  const config = actionConfigs[actionType];

  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
      <div 
        ref={confirmationRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center">
            {config.icon}
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              {config.title}
            </h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-4 py-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">
                {config.message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
              actionType === 'delete' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;