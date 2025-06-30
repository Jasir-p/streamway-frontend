import React, { useState, useEffect } from 'react';
import MeetingsList from './Meetings';
import MeetingForm from './AddMeeting';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useDispatch, useSelector } from 'react-redux';
import { addMeeting, fetchMeeting,deleteMeeting,patchMeeting } from '../../../../../redux/slice/MeetingSlice';
import Swal from 'sweetalert2';
import ConfirmationModal from './components/ConfirmationModal';


const MeetingApp = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) =>state.auth.role)
  const userId = useSelector((state) =>state.profile.id)

  const meetings = useSelector((state) => state.meeting.meetings || []);
  const loading = useSelector((state) => state.meeting.loading);
  const error = useSelector((state) => state.meeting.error);

  const [currentView, setCurrentView] = useState('list');
  const [editingMeeting, setEditingMeeting] = useState(null);
const [confirmModalData, setConfirmModalData] = useState({
  open: false,
  title: '',
  message: '',
  onConfirm: null
});



  useEffect(() => {
    dispatch(fetchMeeting(role==='owner'? null:userId));
  }, [dispatch]);

  const handleCreateNew = () => {
    setEditingMeeting(null);
    setCurrentView('form');
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setCurrentView('form');
  };

const handleSave = (meetingId, meetingData) => {
  if (editingMeeting && meetingId) {
    dispatch(patchMeeting({ id: meetingId, updatedData: meetingData }))
      .unwrap()
      .then(() => {
        setCurrentView('list');
        setEditingMeeting(null);
      })
      .catch((error) => {
        console.error('Failed to update meeting:', error);
      });
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

  const handleStatusChange = ({ id, status }) => {
  setConfirmModalData({
    open: true,
    title: 'Change Meeting Status',
    message: `Are you sure you want to mark this meeting as "${status}"?`,
    onConfirm: () => {
      dispatch(patchMeeting({ id, updatedData: { status } }))
        .unwrap()
        .then(() => {
          setCurrentView('list');
          setEditingMeeting(null);
        })
        .catch((error) => console.error('Failed to update status:', error))
        .finally(() => setConfirmModalData(prev => ({ ...prev, open: false })));
    }
  });
};


  const handleAssigneeChange = (meetingId, newAssignee) => {
  setConfirmModalData({
    open: true,
    title: 'Change Meeting Host',
    message: `Are you sure you want to assign this meeting to "${newAssignee.name}"?`,
    onConfirm: () => {
      dispatch(patchMeeting({ id: meetingId, updatedData: { host: newAssignee.id } }))
        .unwrap()
        .then(() => {
          setCurrentView('list');
          setEditingMeeting(null);
        })
        .catch((error) => console.error('Failed to update host:', error))
        .finally(() => setConfirmModalData(prev => ({ ...prev, open: false })));
    }
  });
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
          onStatusChange={handleStatusChange}
        onAssigneeChange={handleAssigneeChange}
        />
      ) : (
        <MeetingForm 
          meeting={editingMeeting}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <ConfirmationModal
  isOpen={confirmModalData.open}
  title={confirmModalData.title}
  message={confirmModalData.message}
  onConfirm={confirmModalData.onConfirm}
  onCancel={() => setConfirmModalData(prev => ({ ...prev, open: false }))}
/>
    </DashboardLayout>
    
  );
};

export default MeetingApp;
