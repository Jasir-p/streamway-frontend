
import { useState } from 'react';
import { CheckSquare, Square, X, Check } from 'lucide-react';

export default function ConversionPermissionPopup({ onClose }) {
  const [permissions, setPermissions] = useState({
    customer: false,
    contact: false
  });

  const togglePermission = (type) => {
    setPermissions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    // Here you would handle saving the permissions
    console.log('Permissions saved:', permissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium text-gray-900">Conversion Successful</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-2">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          
          <p className="text-center mb-6 text-gray-700">
            Your conversion was completed successfully! Please set permissions below:
          </p>
          
          <div className="space-y-4">
            <div 
              className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => togglePermission('customer')}
            >
              {permissions.customer ? 
                <CheckSquare className="text-blue-600 mr-3" /> : 
                <Square className="text-gray-400 mr-3" />
              }
              <span className="text-gray-800">Customer Permission</span>
            </div>
            
            <div 
              className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => togglePermission('contact')}
            >
              {permissions.contact ? 
                <CheckSquare className="text-blue-600 mr-3" /> : 
                <Square className="text-gray-400 mr-3" />
              }
              <span className="text-gray-800">Contact Permission</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}