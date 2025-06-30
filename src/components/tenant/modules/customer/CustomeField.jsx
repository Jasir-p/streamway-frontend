// CustomFieldModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';

export default function CustomFieldModal({ 
  isOpen, 
  onClose, 
  onAddField, 
  newFieldName = '', 
  setNewFieldName, 
  newFieldValue = '', 
  setNewFieldValue 
}) {
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFieldName.trim() === '') return;
    
    onAddField();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add Custom Field</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">
                    Field Name
                  </label>
                  <input
                    type="text"
                    id="fieldName"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Account Manager"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="fieldValue" className="block text-sm font-medium text-gray-700">
                    Field Value
                  </label>
                  <input
                    type="text"
                    id="fieldValue"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., John Doe"
                  />
                </div>
              </div>
              
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Field
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}