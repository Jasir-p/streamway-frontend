import React, { useState } from 'react';
import { Calendar, Clock, Users, Edit, Trash2, MapPin, Video, Phone, Search, Filter, Plus, BadgeCheck, LucideUserPlus2, X, Save, ChevronDown, User, Mail, Building, FileText } from 'lucide-react';
import { Button } from './components/UiComponent';
import { Badge } from './components/UiComponent';
import { UserDropdownMeeting } from './MeetingUserDropdown';// Import your existing UserDropdown component
import { useSelector } from 'react-redux';


// Meeting Detail Modal Component
export const MeetingDetailModal = ({ meeting, isOpen, onClose, onStatusChange, onAssigneeChange, availableEmployees }) => {
  const [isEditing, setIsEditing] = useState(false);
 
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showHostDropdown, setShowHostDropdown] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) =>state.profile.name)

  if (!isOpen || !meeting) return null;

  const statusOptions = [
 
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' }
  ];

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'default';
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'virtual': return <Video size={20} />;
      case 'call': return <Phone size={20} />;
      default: return <MapPin size={20} />;
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange({id:meeting.id, status:newStatus});
    setShowStatusDropdown(false);
  };

  const handleHostChange = (newHost) => {
    onAssigneeChange(meeting.id, newHost);
    setShowHostDropdown(false);
  };



  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{meeting.title}</h2>
            <Badge variant={getStatusColor(meeting.status)}>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">Date & Time</div>
                      <div className="text-gray-600">{formatDateTime(meeting.start_time)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-gray-600">{meeting.duration} minutes</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getModeIcon(meeting.mode)}
                    <div>
                      <div className="font-medium text-gray-900">Location/Mode</div>
                      <div className="text-gray-600">{meeting.location || 'Virtual Meeting'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {meeting.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{meeting.description}</p>
                </div>
              )}

              {/* Agenda/Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agenda & Notes</h3>
                {isEditing ? (
                  <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add meeting agenda or notes..."
                    value={editedMeeting?.notes || ''}
                    onChange={(e) => setEditedMeeting({...editedMeeting, notes: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-700">
                    {meeting.notes || 'No agenda or notes added yet.'}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Management */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Badge variant={getStatusColor(meeting.status)}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </Badge>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {statusOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>{option.label}</span>
                          {meeting.status === option.value && (
                            <BadgeCheck size={16} className="text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* People */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">People</h3>
                <div className="space-y-4">
                  {/* Contact */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Contact</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <LucideUserPlus2 size={16} className="text-gray-500" />
                        <span className="text-gray-900">{meeting.contact?.name}</span>
                      </div>
                      {meeting.contact?.email && (
                        <div className="flex items-center space-x-2">
                          <Mail size={16} className="text-gray-500" />
                          <span className="text-gray-600">{meeting.contact.email}</span>
                        </div>
                      )}
                      {meeting.contact?.department && (
                        <div className="flex items-center space-x-2">
                          <Building size={16} className="text-gray-500" />
                          <span className="text-gray-600">{meeting.contact.department}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Host */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Current Host</div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                        {meeting.host?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          { meeting.host?.name||'Owner' }
                        </div>
                        <div className="text-xs text-gray-500">
                          {meeting.host?.role?.name || null}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change Host */}
                  {meeting.status!=='completed' &&(<div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Change Host</div>
                    <div className="relative">
                      <button
                        onClick={() => setShowHostDropdown(!showHostDropdown)}
                        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <span className="text-gray-600">Select new host...</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      <UserDropdownMeeting
                        isOpen={showHostDropdown}
                        onSelect={handleHostChange}
                        onClose={() => setShowHostDropdown(false)}
                        selectedUser={meeting.host}
                        placeholder="Select meeting host"
                        className="absolute top-full left-0 right-0 mt-1"
                        currentHost={meeting.host.id}
                      />
                    </div>
                  </div>)}
                  
                </div>
              </div>

              {/* Meeting Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">
                      {new Date(meeting.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meeting ID:</span>
                    <span className="text-gray-900 font-mono">#{meeting.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900 capitalize">{meeting.mode || 'In-person'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
         
        </div>
      </div>
    </div>
  );
};