import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Paperclip, Eye, ExternalLink } from 'lucide-react';

const AttachmentViewer = ({ selectedTask, onClose }) => {
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  

  const processAttachments = () => {
    if (!selectedTask.attachment) return [];
    
    if (typeof selectedTask.attachment === 'string') {

      return [{
        url: selectedTask.attachment,
        name: selectedTask.attachment.split('/').pop(),
        type: getFileType(selectedTask.attachment)
      }];
    } else if (Array.isArray(selectedTask.attachment)) {
      return selectedTask.attachment.map(att => {
        if (typeof att === 'string') {
          return {
            url: att,
            name: att.split('/').pop(),
            type: getFileType(att)
          };
        } else if (att && att.url) {
          return {
            ...att,
            type: att.type || getFileType(att.url)
          };
        }
        return null;
      }).filter(Boolean);
    }
    

    if (selectedTask.attachment && selectedTask.attachment.url) {
      return [{
        url: selectedTask.attachment.url,
        name: selectedTask.attachment.name || selectedTask.attachment.url.split('/').pop(),
        type: selectedTask.attachment.type || getFileType(selectedTask.attachment.url)
      }];
    }
    
    return [];
  };
  

  const getFileType = (url) => {
    if (!url) return 'unknown';
    
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return 'image';
    } else if (url.match(/\.(pdf)$/i)) {
      return 'pdf';
    } else if (url.match(/\.(doc|docx)$/i)) {
      return 'word';
    } else if (url.match(/\.(xls|xlsx)$/i)) {
      return 'excel';
    } else if (url.match(/\.(ppt|pptx)$/i)) {
      return 'powerpoint';
    }
    
    return 'file';
  };
  

  const viewAttachment = (attachment) => {
    setActiveAttachment(attachment);
    setViewerOpen(true);
    setPreviewError(false);
  };
  

  const closeViewer = () => {
    setViewerOpen(false);
    setActiveAttachment(null);
    setPreviewError(false);
  };
  

  const handleImageError = () => {
    setPreviewError(true);
  };
  

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={20} />;
      case 'pdf':
        return <FileText size={20} className="text-red-600" />;
      default:
        return <Paperclip size={20} />;
    }
  };
  

  const getFileColor = (type) => {
    switch (type) {
      case 'image': 
        return 'bg-blue-100 text-blue-700';
      case 'pdf':
        return 'bg-red-100 text-red-700';
      case 'word':
        return 'bg-indigo-100 text-indigo-700';
      case 'excel':
        return 'bg-green-100 text-green-700';
      case 'powerpoint':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const attachments = processAttachments();
  
  // Open attachment in new tab instead of iframe
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">Attachments</h3>
      
      {attachments.length > 0 ? (
        <div className="bg-gray-50 p-3 rounded-lg">
          <ul className="space-y-2">
            {attachments.map((attachment, index) => (
              <li key={index} className="border rounded-md p-3 bg-white flex items-center space-x-3">
                <div className={`p-2 rounded-md flex items-center justify-center ${getFileColor(attachment.type)}`}>
                  {getFileIcon(attachment.type)}
                </div>
                
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-700">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{attachment.type.toUpperCase()}</p>
                </div>
                
                <div className="flex space-x-2">

                  <button
                    onClick={() => openInNewTab(attachment.url)}
                    className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </button>
                  
                  <button
                    onClick={() => viewAttachment(attachment)}
                    className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100 transition-colors"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    className="bg-gray-50 text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Download"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={16} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No attachments for this task.</p>
      )}
      

      {viewerOpen && activeAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">{activeAttachment.name}</h3>
              <button 
                onClick={closeViewer}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {activeAttachment.type === 'image' && !previewError ? (
                <img 
                  src={activeAttachment.url} 
                  alt={activeAttachment.name || 'Image attachment'} 
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={handleImageError}
                />
              ) : activeAttachment.type === 'pdf' || previewError ? (
                <div className="text-center p-8 w-full">
                  <div className="mb-6">
                    <div className="text-6xl mb-4 flex justify-center">
                      {getFileIcon(activeAttachment.type)}
                    </div>
                    <p className="mb-4 text-gray-600">
                      {previewError 
                        ? "There was an issue displaying this file directly in the application." 
                        : "PDF files can't be previewed directly due to browser security restrictions."}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-4 items-center">
                    <button
                      onClick={() => openInNewTab(activeAttachment.url)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Open in New Tab
                    </button>
                    
                    <a
                      href={activeAttachment.url}
                      download={activeAttachment.name}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 inline-flex items-center"
                    >
                      <Download size={16} className="mr-2" />
                      Download File
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">{getFileIcon(activeAttachment.type)}</div>
                  <p className="mb-4 text-gray-600">This file type cannot be previewed directly.</p>
                  <a
                    href={activeAttachment.url}
                    download={activeAttachment.name}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    Download File
                  </a>
                </div>
              )}
            </div>
            
            {/* Footer with actions */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => openInNewTab(activeAttachment.url)}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 mr-2 inline-flex items-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Open in New Tab
              </button>
              <a
                href={activeAttachment.url}
                download={activeAttachment.name}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 mr-2 inline-flex items-center"
              >
                <Download size={16} className="mr-2" />
                Download
              </a>
              <button 
                onClick={closeViewer}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentViewer;