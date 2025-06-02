import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

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

// Meeting Form Component
const MeetingForm = ({ meeting, onSave, onCancel }) => {
  const [formData, setFormData] = useState(meeting || {
    title: '',
    type: 'meeting',
    date: '',
    time: '',
    duration: '30',
    attendees: [],
    location: '',
    mode: 'in-person',
    status: 'scheduled',
    description: ''
  });

  const [attendeeInput, setAttendeeInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addAttendee = () => {
    if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()]
      }));
      setAttendeeInput('');
    }
  };

  const removeAttendee = (index) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
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
        attendees: formData.attendees || []
      };
      onSave(meetingData);
    }
  };

  const meetingTypes = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'call', label: 'Call' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'interview', label: 'Interview' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'training', label: 'Training' }
  ];

  const meetingModes = [
    { value: 'in-person', label: 'In-Person' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'call', label: 'Phone Call' }
  ];

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

              <Select
                label="Meeting Type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                options={meetingTypes}
                required
              />

              <Select
                label="Meeting Mode"
                value={formData.mode}
                onChange={(e) => handleChange('mode', e.target.value)}
                options={meetingModes}
                required
              />

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

              <div className="md:col-span-2">
                <Input
                  label="Location/Link"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Conference room, Zoom link, Teams meeting, etc."
                  required
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="email"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAttendee();
                      }
                    }}
                  />
                  <Button type="button" onClick={addAttendee} size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
                {formData.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {attendee}
                        <button
                          type="button"
                          onClick={() => removeAttendee(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
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