import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';

export default function ConversionOptionsPopup({ selectedLeads, onClose, onConversionComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [convertToContact, setConvertToContact] = useState(false);
  const [convertToCustomer, setConvertToCustomer] = useState(false);
  
  const handleCancel = () => {
    onClose();
  };
  
  const handleConfirm = async () => {
    if (selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    try {
      if (convertToContact || convertToCustomer) {

        const response = await subdomainInterceptors.post('/api/lead_conversion/', {
          lead: selectedLeads,
          convert_to_contact: convertToContact,
          convert_to_customer: convertToCustomer
        });
        
        if (response.status === 200) {
          onConversionComplete(true);
        } else {
          console.error('Error converting leads:', response);
          onConversionComplete(false);
        }
      } else {
        // If nothing selected, just close
        onClose();
      }
    } catch (error) {
      console.error('Error converting leads:', error);
      onConversionComplete(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
        <div className="flex items-center mb-3">
          <CheckCircle className="text-green-500 mr-2" size={20} />
          <h3 className="text-lg font-medium">Status Updated Successfully</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">Would you like to convert this lead?</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="convertToContact"
              checked={convertToContact}
              onChange={(e) => setConvertToContact(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="convertToContact" className="text-gray-700 text-sm">Convert to Contact</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="convertToCustomer"
              checked={convertToCustomer}
              onChange={(e) => setConvertToCustomer(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="convertToCustomer" className="text-gray-700 text-sm">Convert to Customer</label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={handleCancel}
            disabled={isLoading}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}