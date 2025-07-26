import React, { useState, useEffect } from 'react';
import MeetingsList from './Meetings';
import MeetingForm from './AddMeeting';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useDispatch, useSelector } from 'react-redux';
import { addMeeting, fetchMeeting,deleteMeeting,patchMeeting } from '../../../../../redux/slice/MeetingSlice';
import Swal from 'sweetalert2';
import ConfirmationModal from './components/ConfirmationModal';
import { useMeetingPermissions } from '../../../authorization/useMeetingPermissions';
import { useDebounce } from '../../../../../hooks/useDebounce';


const MeetingApp = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) =>state.auth.role)
  const userId = useSelector((state) =>state.profile.id)
  const [searchQuery, setSearchQuery] = useState('');

  const meetings = useSelector((state) => state.meeting.meetings || []);
  const loading = useSelector((state) => state.meeting.loading);
  const error = useSelector((state) => state.meeting.error);
   const debouncedSearchQuery = useDebounce(searchQuery, 500)
   const [statusFilter, setStatusFilter] = useState('all');

  const [currentView, setCurrentView] = useState('list');
  const [editingMeeting, setEditingMeeting] = useState(null);
const [confirmModalData, setConfirmModalData] = useState({
  open: false,
  title: '',
  message: '',
  onConfirm: null
});



useEffect(() => {
  const filters = buildFilterParams();
    if (role !== 'owner') {
    filters.userId = userId;
  }
  dispatch(fetchMeeting( filters)); 
}, [dispatch, debouncedSearchQuery, statusFilter,userId,role]);


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

  const buildFilterParams = () => {
  const params = {};

  if (debouncedSearchQuery.trim()) {
    params.search = debouncedSearchQuery.trim();
  }


  if (statusFilter !== 'all') {
    params.status = statusFilter;
  }

  return params;
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
      {currentView === 'list' ? (
        <MeetingsList 
          meetings={meetings}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange} 
          searchQuery = {searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
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
