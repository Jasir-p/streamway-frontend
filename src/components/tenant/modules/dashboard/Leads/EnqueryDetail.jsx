import React from "react";
import formatTimeAgo from '../../../../utils/formatTimeAgo';

const EnquiryDetails = ({ isOpen, onClose, details }) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enquiry Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID:</label>
            <p className="mt-1 text-sm text-gray-900">{details.web_id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <p className="mt-1 text-sm text-gray-900">{details.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <p className="mt-1 text-sm text-gray-900">{details.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone:</label>
            <p className="mt-1 text-sm text-gray-900">{details.phone_number}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Source:</label>
            <p className="mt-1 text-sm text-gray-900">{details.source}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned By:</label>
            <p className="mt-1 text-sm text-gray-900">
              {details.granted_by?.name || details.employee ? "Owner" : "Not Assigned"}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To:</label>
            <p className="mt-1 text-sm text-gray-900">
              {details.employee?.name || "Not Assigned"}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Created:</label>
            <p className="mt-1 text-sm text-gray-900">
              <span className={`px-2 py-1 rounded-full text-xs ${details.lead_created ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {details.lead_created ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Created At:</label>
            <p className="mt-1 text-sm text-gray-900">{formatTimeAgo(details.created_at)}</p>
          </div>
          
          
          {details?.custome_fields &&
                    Object.entries(details.custome_fields).map(([key, value]) => (
                      
                      <div>
              <label className="block text-sm font-medium text-gray-700">{key}</label>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{value}</p>
            </div>
                    ))
            
            }
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetails;