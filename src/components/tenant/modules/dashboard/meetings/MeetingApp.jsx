import React, { useState } from 'react';
import MeetingsList from './Meetings';
import MeetingForm from './AddMeeting';
import DashboardLayout from '../../../dashboard/DashbordLayout';


// Main App Component - Orchestrates between MeetingsList and MeetingForm
const MeetingApp = () => {
  // Sample data - same as original
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Product Strategy Review",
      type: "meeting",
      date: "2024-05-23",
      time: "10:00",
      duration: "60",
      attendees: ["john@example.com", "jane@example.com", "mike@example.com"],
      location: "Conference Room A",
      mode: "in-person",
      status: "scheduled",
      description: "Quarterly product strategy review and planning session"
    },
    {
      id: 2,
      title: "Client Onboarding Call",
      type: "call",
      date: "2024-05-24",
      time: "14:30",
      duration: "30",
      attendees: ["sarah@example.com", "david@example.com"],
      location: "https://zoom.us/j/123456789",
      mode: "virtual",
      status: "confirmed",
      description: "Initial onboarding call with new client"
    }
  ]);

  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [editingMeeting, setEditingMeeting] = useState(null);

  // Handle creating new meeting
  const handleCreateNew = () => {
    setEditingMeeting(null);
    setCurrentView('form');
  };

  // Handle editing existing meeting
  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setCurrentView('form');
  };

  // Handle saving meeting (both create and update)
  const handleSave = (meetingData) => {
    if (editingMeeting) {
      // Update existing meeting
      setMeetings(prev => prev.map(m => m.id === meetingData.id ? meetingData : m));
    } else {
      // Create new meeting
      setMeetings(prev => [...prev, meetingData]);
    }
    
    // Return to list view and clear editing state
    setCurrentView('list');
    setEditingMeeting(null);
  };

  // Handle deleting meeting
  const handleDelete = (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(prev => prev.filter(m => m.id !== meetingId));
    }
  };

  // Handle canceling form (return to list)
  const handleCancel = () => {
    setCurrentView('list');
    setEditingMeeting(null);
  };

  // Render appropriate view based on current state
  return (
    <DashboardLayout>
      {currentView === 'list' ? (
        <MeetingsList 
          meetings={meetings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
        />
      ) : (
        <MeetingForm 
          meeting={editingMeeting}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </DashboardLayout>
  );
};

export default MeetingApp;