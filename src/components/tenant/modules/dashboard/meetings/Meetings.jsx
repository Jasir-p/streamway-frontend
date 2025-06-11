import React, { useState } from 'react';
import { Calendar, Clock, Users, Edit, Trash2, MapPin, Video, Phone, Search, Filter, Plus, BadgeCheck,LucideUserPlus2} from 'lucide-react';

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

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800",
    danger: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Meeting Card Component
const MeetingCard = ({ meeting, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'virtual': return <Video size={16} />;
      case 'call': return <Phone size={16} />;
      default: return <MapPin size={16} />;
    }
  };

const formatDate = (startTime) => {
  const date = new Date(startTime);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatTime = (startTime) => {
  const date = new Date(startTime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{meeting.title}</h3>
          <Badge variant={getStatusColor(meeting.status)}>
            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(meeting)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(meeting.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <LucideUserPlus2 size={16} />
          <span>{meeting.contact?.name}</span>
          <span >{meeting.contact?.department}</span>

          
        
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>{formatDate(meeting.start_time)}</span>
          <Clock size={16} />
          <span>{formatTime(meeting.start_time)} ({meeting.duration} min)</span>
        </div>
        
     
        
        <div className="flex items-center space-x-2">
          <Users size={16} />
          <span>{meeting.host?.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <BadgeCheck size={16} />
          <span>{meeting.created_by?.name || "Owner"}</span>
        </div>
      </div>
      
      {meeting.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{meeting.description}</p>
      )}
    </div>
  );
};

// Meetings List Component
const MeetingsList = ({ meetings, onEdit, onDelete, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredMeetings = meetings?.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || meeting.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600">Manage your meeting schedule</p>
          </div>
          <Button onClick={onCreateNew} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>New Meeting</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Meeting Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{meetings?.length}</div>
            <div className="text-sm text-blue-700">Total Meetings</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {meetings?.filter(m => m.status === 'confirmed').length}
            </div>
            <div className="text-sm text-green-700">Confirmed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {meetings?.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {meetings?.filter(m => new Date(m.date) >= new Date().setHours(0,0,0,0)).length}
            </div>
            <div className="text-sm text-purple-700">Upcoming</div>
          </div>
        </div>

        {/* Meetings Grid */}
        {filteredMeetings?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first meeting.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={onCreateNew}>Create Meeting</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeetings?.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsList;