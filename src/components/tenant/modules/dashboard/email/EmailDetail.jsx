import { useState } from 'react';
import { X, User, Calendar, Mail } from 'lucide-react';


export const EmailDetailModal = ({ email, isOpen, onClose }) => {
  if (!isOpen || !email) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl h-3/4 flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold truncate">{email.subject}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sender Information Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User size={32} className="text-blue-600" />
              </div>
              <div className="flex-1">
                {email.sender ? (
                  <>
                    <h3 className="text-xl font-bold mb-1">{email.sender.name}</h3>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <User size={16} />
                      <span>{email.sender.role.name}</span>
                    </div>
                  </>
                ) : (
                  <h3 className="text-xl font-bold mb-1">Administrator</h3>
                )}
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} />
                  <span>{new Date(email.sent_at).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                {email.sender?.role.name && (
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Sales
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Email Content */}
          {/* Email Content */}
        
          <div
            className="text-gray-800 text-base"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
       

          
          {/* Attachments Section if applicable */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="text-lg font-medium mb-2">Attachments ({email.attachments.length})</h4>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map(attachment => (
                  <div key={attachment.id} className="bg-gray-100 rounded-md p-2 flex items-center gap-2">
                    <div className="text-xs text-gray-600">{attachment.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};