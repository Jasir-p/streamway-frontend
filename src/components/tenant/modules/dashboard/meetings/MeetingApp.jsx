import React, { useState, useEffect } from 'react';
import MeetingsList from './Meetings';
import MeetingForm from './AddMeeting';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useDispatch, useSelector } from 'react-redux';
import { addMeeting, fetchMeeting,deleteMeeting,patchMeeting } from '../../../../../redux/slice/MeetingSlice';
import Swal from 'sweetalert2';

const MeetingApp = () => {
  const dispatch = useDispatch();


  const meetings = useSelector((state) => state.meeting.meetings || []);
  const loading = useSelector((state) => state.meeting.loading);
  const error = useSelector((state) => state.meeting.error);

  const [currentView, setCurrentView] = useState('list');
  const [editingMeeting, setEditingMeeting] = useState(null);


  useEffect(() => {
    dispatch(fetchMeeting());
  }, [dispatch]);

  const handleCreateNew = () => {
    setEditingMeeting(null);
    setCurrentView('form');
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setCurrentView('form');
  };

  const handleSave = (meetingData) => {
    if (editingMeeting) {
      // Update logic here if needed
      setCurrentView('list');
      setEditingMeeting(null);
    } else {
      dispatch(addMeeting(meetingData))
        .unwrap()
        .then(() => {
          setCurrentView('list');
          setEditingMeeting(null);
        })
        .catch((error) => {
          console.error('Failed to add meeting:', error);
        });
    }
  };

const handleDelete = (meetingId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(deleteMeeting(meetingId)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          Swal.fire('Deleted!', 'The meeting has been deleted.', 'success');
        } else {
          Swal.fire('Error', 'Failed to delete the meeting.', 'error');
        }
      });
    }
  });
};

  const handleCancel = () => {
    setCurrentView('list');
    setEditingMeeting(null);
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading meetings...</div>
      ) : currentView === 'list' ? (
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
