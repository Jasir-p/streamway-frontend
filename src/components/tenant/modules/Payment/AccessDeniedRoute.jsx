import React, { useState } from 'react';
import { X, AlertTriangle, Building2, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Logout } from '../../authentication/Authentication';


export default function EmployeeAccessModal({ onClose, tenantBilling }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const isExpired = tenantBilling?.billing_expiry && new Date(tenantBilling.billing_expiry) < new Date();

  if (!isOpen || !isExpired) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Access Denied
            </h2>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <Building2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Account Access Suspended
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your company's account access has been temporarily suspended. 
              Please contact your company administrator or IT department to restore access.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Need Help?
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>Contact your company's IT support</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>Reach out to your system administrator</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={()=>Logout(role,navigate)}
            className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}