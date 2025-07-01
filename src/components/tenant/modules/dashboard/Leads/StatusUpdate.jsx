import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';
import { useCustomerPermissions } from '../../../authorization/useCustomerPermissions';

import ConversionOptionsPopup from './ConvertPopup';
import { useSelector } from 'react-redux';


export default function StatusUpdateConfirmation({ selectedLeads, onUpdateComplete, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [showConversionPopup, setShowConversionPopup] = useState(false);

 const {canAdd}=useCustomerPermissions()

   const canAddcustomer = canAdd
  
  const statusOptions = [
    "new",
    "contacted",
    "follow_up",
    "Proposal",
    "Negotiation",
    "converted",
    "lost"
  ];

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleCancel = () => {
    onCancel();
  };
  
  const handleConversionComplete = (success) => {
    setShowConversionPopup(false);
    onUpdateComplete(true); // Notify parent component that everything is complete
  };
  
  const handleConfirm = async () => {
    if (selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Call your API to update the lead status
      const response = await subdomainInterceptors.patch('/api/lead_status/', {
        lead_id: selectedLeads,
        status: selectedStatus
      });
      
      if (response.status === 200) {
        console.log("halooo");
        
        if (selectedStatus.toLowerCase() === "converted" && (canAddcustomer)) {
            setShowConversionPopup(true);
          } else {
            onUpdateComplete(true); // No popup, just complete
          }

      } else {
        console.error('Error updating lead status:', response);
        onUpdateComplete(false);
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      onUpdateComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!showConversionPopup ? (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-indigo-600 mr-2" size={24} />
              <h3 className="text-lg font-medium text-gray-900">Update Lead Status</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                You are about to update the status for <span className="font-semibold">{selectedLeads.length}</span> selected lead{selectedLeads.length !== 1 ? 's' : ''}
              </p>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select New Status:
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Confirm Update'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ConversionOptionsPopup
          selectedLeads={selectedLeads}
          onClose={() => {
            setShowConversionPopup(false);
            onUpdateComplete(true);
          }}
          onConversionComplete={handleConversionComplete}
         
        />
      )}
    </>
  );
}