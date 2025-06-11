import React, { useState, useRef, useEffect } from 'react';
import { X, Plus,ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { fetchAccounts } from '../../../../../redux/slice/AccountsSlice';
import { useDispatch } from 'react-redux';
import { selectContactByAccount } from '../../../../../Intreceptors/ActivityApiHandle';


// UI Components
const Button = ({ children, variant = "primary", size = "md", onClick, disabled = false, className = "", type = "button" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "hover:bg-gray-100 text-gray-600"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, required = false, className = "", min }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

const Select = ({ label, value, onChange, options, required = false, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const TextArea = ({ label, value, onChange, placeholder, rows = 3, required = false, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
      />
    </div>
  );
};

const UserDropdown = ({ isOpen, onSelect, onClose, selectedUser, placeholder = 'Select meeting host', className = '' }) => {
  const dropdownRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUser(role === 'owner' ? role : profile.id);
        setUsers(Array.isArray(response) ? response : response ? [response] : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, role, profile.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`relative w-full max-w-xs bg-white rounded-lg shadow-lg text-gray-800 z-50 py-2 ${className}`}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
        {placeholder}
      </div>
      
      {loading ? (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          Loading users...
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {users.length > 0 ? (
            users.map(user => (
              <div 
                key={user.id}
                className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50 font-medium' : ''
                }`}
                onClick={() => {
                  onSelect(user);
                }}
              >
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {user.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role?.name || 'User'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Account Dropdown Component with Pagination
export const AccountDropdown = ({ isOpen, onSelect, onClose, selectedAccount, placeholder = 'Select account', className = '' }) => {
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {accounts, next,previous} = useSelector((state)=>state.accounts)
  const itemsPerPage = 5;
  const dispatch = useDispatch();
useEffect(()=>{
  dispatch(fetchAccounts());
  
},[dispatch])
  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset search and pagination when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handlePrevPage = () => {
 
      dispatch(fetchAccounts(previous));
    
  };

  const handleNextPage = () => {
    dispatch(fetchAccounts(next))
    
  };

  const handleAccountSelect = (account) => {
    onSelect(account);
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 w-full bg-white rounded-lg shadow-lg text-gray-800 z-50 border border-gray-200 ${className}`}
    >
      {/* Header with search */}
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-2">
          {placeholder}
        </div>
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Accounts list */}
      <div className="max-h-64 overflow-y-auto">
        {currentAccounts.length > 0 ? (
          currentAccounts.map(account => (
            <div 
              key={account.id}
              className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                selectedAccount?.id === account.id ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => handleAccountSelect(account)}
            >
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                {account.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{account.name}</div>
                <div className="text-xs text-gray-500">{account.email} contacts</div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            {searchTerm ? 'No accounts match your search' : 'No accounts available'}
          </div>
        )}
      </div>

      {/* Pagination footer */}
     {(next || previous) && (
  <div className="flex justify-between items-center py-4">
    <div className="text-sm text-gray-600">
      Showing {startIndex + 1}-{Math.min(endIndex, filteredAccounts.length)} of {filteredAccounts.length}
    </div>
    
    <div className="flex items-center gap-4">
      {/* Previous Arrow */}
      <div 
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          !previous 
            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' 
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 cursor-pointer'
        }`}
        onClick={previous ? handlePrevPage : undefined}
      >
        <ChevronLeft size={20} />
      </div>
      

      <span className="text-sm font-medium text-gray-700 min-w-20 text-center">
        {currentPage} of {totalPages}
      </span>
      

      <div 
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          !next 
            ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' 
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 cursor-pointer'
        }`}
        onClick={next ? handleNextPage : undefined}
      >
        <ChevronRight size={20} />
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Contact Dropdown Component
const ContactDropdown = ({ isOpen, onSelect, onClose, selectedContact, account, placeholder = 'Select contact', className = '' }) => {
  const dropdownRef = useRef(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  useEffect(() => {
    const fetchContacts = async () => {
      
      try {
        const response = await selectContactByAccount(account.id);
        setContacts(Array.isArray(response) ? response : response ? [response] : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setContacts([]);
      } finally {
        
      }
    };
    
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 w-full bg-white rounded-lg shadow-lg text-gray-800 z-50 py-2 border border-gray-200 ${className}`}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
        {placeholder}
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <div 
              key={contact.id}
              className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                selectedContact?.id === contact.id ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => onSelect(contact)}
            >
              <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                {contact.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{contact.name}</div>
                <div className="text-xs text-gray-500">{contact.department}</div>
                <div className="text-xs text-gray-400">{contact.email}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No contacts available
          </div>
        )}
      </div>
    </div>
  );
};

// Meeting Form Component
const MeetingForm = ({ meeting, onSave, onCancel }) => {
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);
  const [formData, setFormData] = useState(meeting || {
    title: '',
    type: 'meeting',
    date: '',
    time: '',
    duration: '30',
    host: null,
    status: 'scheduled',
    description: '',
    account: null,
    contact: null,
    created_by: role !== 'owner' ? profile.id : null
  });
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
      setFormData(prev => ({ ...prev, host: profile }));
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
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.host) newErrors.host = 'Host is required';
    
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
        host: formData.host.id,
        account: formData.account?.id || null,
        contact: formData.contact?.id || null
      };
      onSave(meetingData);
    }
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

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
                  value={formData.date}
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

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                options={statusOptions}
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
              <div className="md:col-span-2">
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
                      <UserDropdown
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
              </div>

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