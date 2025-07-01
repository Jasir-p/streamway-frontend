import React, { useState, useRef, useEffect } from 'react';
import { X, Plus,ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { UserDropdownMeeting } from './MeetingUserDropdown';
import { Button,TextArea,Select,Input } from './components/UiComponent';
import { AccountDropdown,ContactDropdown } from './components/MeetingDropDown';
import { format } from 'date-fns';



// Meeting Form Component
const MeetingForm = ({ meeting, onSave, onCancel }) => {
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);
 const initialFormData = meeting ? {
  title: meeting.title || '',
  type: meeting.type || 'meeting',
  date: format(new Date(meeting.start_time), 'yyyy-MM-dd'),
  time: format(new Date(meeting.start_time), 'HH:mm'),
  duration: meeting.duration || '30',
  host: meeting.host || null,
  status: meeting.status,
  description: meeting.description || '',
  account: meeting.account || null,
  contact: meeting.contact || null,
  created_by: meeting.created_by || null
} : {
  title: '',
  type: 'meeting',
  date: '',
  time: '',
  duration: '30',
  host: null,
  description: '',
  account: null,
  contact: null,
  created_by: role !== 'owner' ? profile.id : null
};
const [formData, setFormData] = useState(initialFormData);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [hostType, setHostType] = useState('you');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHostTypeChange = (type) => {
    setHostType(type);

    if (type === 'you') {
      setFormData(prev => ({ ...prev, host: role ==='owner'?null:profile }));
      setIsUserDropdownOpen(false);
    } else {
      setFormData(prev => ({ ...prev, host: null }));
      setIsUserDropdownOpen(true);
    }

    if (errors.host) {
      setErrors(prev => ({ ...prev, host: '' }));
    }
  };

  const handleHostChange = (selectedUser) => {
    setFormData(prev => ({ ...prev, host: selectedUser }));
    setIsUserDropdownOpen(false);
    if (errors.host) {
      setErrors(prev => ({ ...prev, host: '' }));
    }
  };

  const handleAccountChange = (selectedAccount) => {
    setFormData(prev => ({ 
      ...prev, 
      account: selectedAccount,
      contact: null // Reset contact when account changes
    }));
    setIsAccountDropdownOpen(false);
    setIsContactDropdownOpen(false);
    if (errors.account) {
      setErrors(prev => ({ ...prev, account: '' }));
    }
  };

  const handleContactChange = (selectedContact) => {
    setFormData(prev => ({ ...prev, contact: selectedContact }));
    setIsContactDropdownOpen(false);
    if (errors.contact) {
      setErrors(prev => ({ ...prev, contact: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()&& !meeting) newErrors.title = 'Title is required';
    if (!formData.date && !meeting) newErrors.date = 'Date is required';
    if (!formData.time && !meeting) newErrors.time = 'Time is required';
     if (role !== 'owner' && !formData.host && !meeting) {
      newErrors.host = 'Host is required';
    }
    if (!formData.contact && !meeting) newErrors.contact ='Conatct is required'

    
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    if (selectedDate < new Date()) {
      newErrors.date = 'Meeting date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const meetingData = {
        ...formData,
        id: meeting?.id || Date.now(),
        host: formData.host?formData.host.id:null,
        account: formData.account?.id || null,
        contact: formData.contact?.id || null
      };
      onSave(meeting ? meeting.id : null, meetingData);


    }
  };


  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {meeting ? 'Edit Meeting' : 'Create New Meeting'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {meeting ? 'Update meeting details' : 'Fill in the details for your new meeting'}
              </p>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Meeting Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter meeting title"
                  required
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Input
                  label="Date"
                  type="date"
                  value={meeting ? formData.date : today}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={today}
                  required
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <Input
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                required
              />

              <Select
                label="Duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                options={durationOptions}
                required
              />

            

              {/* Account Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account
                </label>
                <div 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                >
                  {formData.account ? (
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                        {formData.account.name.charAt(0)}
                      </div>
                      <span className="text-sm">{formData.account.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Select account...</span>
                  )}
                </div>
                <AccountDropdown
                  isOpen={isAccountDropdownOpen}
                  onClose={() => setIsAccountDropdownOpen(false)}
                  onSelect={handleAccountChange}
                  selectedAccount={formData.account}
                  placeholder="Select account"
                />
              </div>

              {/* Contact Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <div 
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white ${
                    !formData.account ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (formData.account) {
                      setIsContactDropdownOpen(!isContactDropdownOpen);
                    }
                  }}
                >
                  {formData.contact ? (
                    <div className="flex items-center">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                        {formData.contact.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium">{formData.contact.name}</span>
                        <div className="text-xs text-gray-500">{formData.contact.position}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {formData.account ? 'Select contact...' : 'Select account first'}
                    </span>
                  )}
                </div>
                <ContactDropdown
                  isOpen={isContactDropdownOpen}
                  onClose={() => setIsContactDropdownOpen(false)}
                  onSelect={handleContactChange}
                  selectedContact={formData.contact}
                  account ={formData.account}
                  placeholder="Select contact"
                />
              </div>

              {/* Host Selection */}
              {!meeting &&(<div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Host <span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="host-you"
                      name="hostType"
                      checked={hostType === 'you'}
                      onChange={() => handleHostTypeChange('you')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="host-you" className="ml-2 text-sm font-medium text-gray-700">
                      You (Host the meeting yourself)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="host-other"
                      name="hostType"
                      checked={hostType !== 'you'}
                      onChange={() => handleHostTypeChange('other')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="host-other" className="ml-2 text-sm font-medium text-gray-700">
                      Select another user as host
                    </label>
                  </div>
                  
                  {isUserDropdownOpen && (
                    <div className="ml-6 border border-gray-300 rounded-md p-3 bg-white relative">
                      <UserDropdownMeeting
                        isOpen={isUserDropdownOpen}
                        onClose={() => setIsUserDropdownOpen(false)}
                        onSelect={handleHostChange}
                        selectedUser={formData.host === 'you' ? null : formData.host}
                        placeholder="Select meeting host"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                
                {errors.host && <p className="text-red-500 text-sm mt-1">{errors.host}</p>}
                
                {formData.host && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
                    <span className="text-sm text-blue-800">
                      Selected Host: <strong>
                        {hostType === 'you' 
                          ? 'You' 
                          : (formData.host?.name || formData.host?.email || 'Unknown')}
                      </strong>
                    </span>
                  </div>
                )}
              </div>)}
              

              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Meeting agenda, notes, objectives..."
                  rows={4}
                />
              </div>
            </div>

            {/* Selected Account and Contact Summary */}
            {(formData.account || formData.contact) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Details</h4>
                {formData.account && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Account: </span>
                    <span className="text-sm font-medium text-gray-900">{formData.account.name}</span>
                    
                  </div>
                )}
                {formData.contact && (
                  <div>
                    <span className="text-sm text-gray-600">Contact: </span>
                    <span className="text-sm font-medium text-gray-900">{formData.contact.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({formData.contact.department})</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {meeting ? 'Update Meeting' : 'Create Meeting'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingForm;