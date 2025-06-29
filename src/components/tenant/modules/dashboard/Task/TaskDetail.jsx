import React, { useState, useCallback, useMemo,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AttachmentViewer from './Attachment';
import UserDropdown from './TaskAsigndropDown';
import { taskChange } from '../../../../../Intreceptors/ActivityApiHandle';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { getMembers } from '../../Team/api/teamapi';
import { getDueDateLabel } from './utlis/taskUtlity';

// Constants
const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COMPLETED', label: 'Completed' }
];

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-200 text-red-900',
  HIGH: 'bg-orange-100 text-orange-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW: 'bg-green-100 text-green-800'
};

const NAVIGATION_ROUTES = {
  lead: (id) => `/dashboard/sale/leads/${id}`,
  account: (id) => `/dashboard/customer/accounts/${id}`,
  contact: () => '/dashboard/customer/contacts',
  user: () => '/setting/users',
  edit: (id) => `/dashboard/tasks/edit/${id}`
};

// Custom Hooks
const useConfirmAction = () => {
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    message: '',
    onConfirm: null
  });

  const showConfirmation = useCallback((message, onConfirm) => {
    setConfirmAction({ show: true, message, onConfirm });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmAction({ show: false, message: '', onConfirm: null });
  }, []);

  const executeConfirmation = useCallback(() => {
    if (confirmAction.onConfirm) {
      confirmAction.onConfirm();
    }
    hideConfirmation();
  }, [confirmAction.onConfirm, hideConfirmation]);

  return {
    confirmAction,
    showConfirmation,
    hideConfirmation,
    executeConfirmation
  };
};

// Components
const PriorityBadge = React.memo(({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority?.toLowerCase()] || PRIORITY_COLORS.medium;
  const displayText = priority ? 
    priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase() : 
    'Medium';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayText}
    </span>
  );
});

const ConfirmationDialog = React.memo(({ confirmAction, onConfirm, onCancel }) => {
  if (!confirmAction.show) return null;

  return (
    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <p className="text-yellow-700 mb-2">{confirmAction.message}</p>
      <div className="flex space-x-2">
        <button
          onClick={onConfirm}
          className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

const DetailField = React.memo(({ label, children, onClick }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div 
      onClick={onClick} 
      className={onClick ? "cursor-pointer hover:text-blue-600 transition-colors" : ""}
    >
      {children}
    </div>
  </div>
));

const PersonInfo = React.memo(({ person, showRole = true, onClick }) => {
  if (!person) return <span className="text-sm text-gray-500">Unassigned</span>;

  return (
    <p 
      className={`text-sm font-medium ${onClick ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`} 
      onClick={onClick}
    >
      {person.name}
      {showRole && person.role && <span className="text-gray-600"> ({person.role.name})</span>}
    </p>
  );
});

const AssignmentInfo = React.memo(({ task, isOwner, onViewAssignee }) => {
  const primaryAssignee = task.assignees?.[0];

  if (task.is_team) {
    return (
      <div className="space-y-2">
        {task.assigned_to_team && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-blue-600 font-medium">TEAM ASSIGNMENT</p>
            <p className="text-sm font-medium">{task.assigned_to_team.name}</p>
          </div>
        )}
        
        <div className="ml-2">
          <p className="text-xs text-gray-500">Assigned Employee:</p>
          {primaryAssignee ? (
            <PersonInfo 
              person={primaryAssignee}
              onClick={isOwner ? onViewAssignee : undefined}
            />
          ) : (
            <p className="text-sm text-gray-500">No specific employee assigned</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 p-2 rounded">
      <p className="text-xs text-green-600 font-medium">DIRECT ASSIGNMENT</p>
      <PersonInfo 
        person={primaryAssignee}
        onClick={isOwner ? onViewAssignee : undefined}
      />
    </div>
  );
});

const TaskDetailView = ({ 
  task, 
  onClose, 
  onDelete, 
  onChange,
  
}) => {
  const role = useSelector(state => state.auth.role);
  const userId = useSelector(state =>state.profile.id)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
console.log(task.assigned_to_team?.id);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let data;
        if (task.is_team && task.assigned_to_team.id) {
          data = await getMembers(task.assigned_to_team.id); 
        } else {
          data = await getUser(role === 'owner' ? role : userId); 
        }

        if (data) {
          setEmployees(data);
        }
      } catch (err) {
        console.error("Failed to load assignee list:", err);
      }
    };

    fetchEmployees();
  }, [task.is_team, task.assigned_to_team?.id, userId, role]);
  const {
    confirmAction,
    showConfirmation,
    hideConfirmation,
    executeConfirmation
  } = useConfirmAction();

  // Memoized values
  const isOwner = useMemo(() => role === 'owner', [role]);
  const primaryAssignee = useMemo(() => task.assignees?.[0], [task.assignees]);
  const { label, color } = getDueDateLabel(task.dueDate, task.status);
  const formattedDates = useMemo(() => {
    const formatDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleString();
      } catch (error) {
        return 'Invalid date';
      }
    };

    return {
      created: formatDate(task.created_at),
      updated: formatDate(task.updated_at),
      duedate:formatDate(task.dueDate)
    };
  }, [task.created_at, task.updated_at]);

  // Navigation handlers
  const handleNavigation = useCallback((type, id) => {
    try {
      const route = NAVIGATION_ROUTES[type](id);
      navigate(route);
      onClose();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate, onClose]);

  const navigationHandlers = useMemo(() => ({
    viewLead: () => task.lead && handleNavigation('lead', task.lead.lead_id),
    viewAccount: () => task.account && handleNavigation('account', task.account.id),
    viewContact: () => task.contact && handleNavigation('contact'),
    viewAssignee: () => primaryAssignee && isOwner && handleNavigation('user'),
    editTask: () => handleNavigation('edit', task.id)
  }), [task, primaryAssignee, isOwner, handleNavigation]);

  // API handlers with better error handling
  const handleApiCall = useCallback(async (apiCall, successMessage = 'Updated successfully') => {
    setIsLoading(true);
    try {
      const response = await apiCall();
      console.log(successMessage, response.data);
      onChange();
      return response;
    } catch (error) {
      console.error('API call failed:', error);
      // You might want to show a toast notification here
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  const handleStatusChange = useCallback(async (newStatus) => {
    await handleApiCall(
      () => taskChange(task.id, { status: newStatus }),
      'Status updated'
    );
    onClose();
  }, [task.id, handleApiCall, onClose]);

  const handleAssignedByChange = useCallback(async (newAssignedById) => {
    await handleApiCall(
      () => taskChange(task.id, { assigned_to_employee: newAssignedById }),
      'Assigned by updated'
    );
    onClose()
  }, [task.id, handleApiCall]);

  const handleDeleteTask = useCallback(() => {
    onDelete(task.id);
    onClose();
  }, [onDelete, task.id, onClose]);

  // Action handlers
  const actionHandlers = useMemo(() => ({
    confirmStatusChange: (status) => {
      const statusLabel = STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;
      showConfirmation(
        `Change status to "${statusLabel}"?`, 
        () => handleStatusChange(status)
      );
    },
    confirmDelete: () => showConfirmation(
      "Are you sure you want to delete this task? This action cannot be undone.", 
      handleDeleteTask
    ),
    confirmAssignedByChange: (userId) => showConfirmation(
      "Change who assigned this task?",
      () => handleAssignedByChange(userId)
    )
  }), [showConfirmation, handleStatusChange, handleDeleteTask, handleAssignedByChange]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
          <div className="flex space-x-2">
            <button 
              className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
              onClick={navigationHandlers.editTask}
              disabled={isLoading}
            >
              Edit
            </button>
            <button 
              className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors"
              onClick={actionHandlers.confirmDelete}
              disabled={isLoading}
            >
              Delete
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm">Updating...</p>
          </div>
        )}
        
        {/* Confirmation Dialog */}
        <ConfirmationDialog 
          confirmAction={confirmAction}
          onConfirm={executeConfirmation}
          onCancel={hideConfirmation}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>
          </div>
          
          {/* Details Panel */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
            
            <div className="space-y-4">
              {/* Status */}
              <DetailField label="Status">
                <div className="space-y-2">
                  <p className="text-sm font-medium capitalize">{task.status?.replace('_', ' ').toLowerCase()}</p>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    value={task.status}
                    onChange={(e) => actionHandlers.confirmStatusChange(e.target.value)}
                    disabled={isLoading}
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </DetailField>

              {/* Priority */}
              <DetailField label="Priority">
                <PriorityBadge priority={task.priority} />
              </DetailField>

              {/* Assignment */}
              <DetailField label="Assignment">
                <AssignmentInfo 
                  task={task}
                  isOwner={isOwner}
                  onViewAssignee={navigationHandlers.viewAssignee}
                />
              </DetailField>
               {isOwner && task.status!=='COMPLETED' && (
              <DetailField >
                <div className="space-y-2">
                  
                  
                 
                    <UserDropdown
                      value={task.assigned_by?.id || null}
                      onChange={actionHandlers.confirmAssignedByChange}
                      isTeam={task.is_team}
                      employees={employees}
                      placeholder={task.assigned_by ? "Change assigned ":null}
                      className="text-sm"
                      disabled={isLoading}
                    />
                 
                </div>
              </DetailField>
               )}

              {/* Created By */}
              <DetailField label="Created By">
                <PersonInfo person={task.created_by} />
              </DetailField>

              {/* Assigned By */}
              

              {/* Dates */}
              <DetailField label="Created">
                <p className="text-sm text-gray-600">{formattedDates.created}</p>
              </DetailField>

              <DetailField label="Last Updated">
                <p className="text-sm text-gray-600">{formattedDates.updated}</p>
              </DetailField>

              {/* Related Entities */}
              {task.lead && (
                <DetailField label="Lead" onClick={navigationHandlers.viewLead}>
                  <p className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    {task.lead.lead_id}
                  </p>
                </DetailField>
              )}

              {task.contact && (
                <DetailField label="Contact" onClick={navigationHandlers.viewContact}>
                  <p className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    {task.contact.name}
                  </p>
                </DetailField>
              )}

              {task.account && (
                <DetailField label="Account" onClick={navigationHandlers.viewAccount}>
                  <p className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    {task.account.name}
                  </p>
                </DetailField>
              )}
            </div>
          </div>
        </div>
        
        {/* Subtasks */}
        {task.subtasks?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">Subtasks ({task.subtasks.length})</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {task.subtasks.map(subtask => (
                  <li key={subtask.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={subtask.completed || false}
                      className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      readOnly
                    />
                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachment?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">Attachments</h3>
            <AttachmentViewer selectedTask={task} />
          </div>
        )}

        {/* Activity */}
        <div>
          <h3 className="text-md font-semibold mb-3">Activity</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-medium">Created:</span> {task.created_by?.name || 'Unknown'} on {formattedDates.created}
              </p>


              <p>
                <span className="font-medium">Due Date:</span>{' '}
                <span className={color}>{label}</span>
              </p>


              {task.assigned_by && (
                <p>
                  <span className="font-medium">Assigned by:</span> {task.assigned_by.name}
                </p>
              )}

              {primaryAssignee && (
                <p>
                  <span className="font-medium">Currently assigned to:</span> {primaryAssignee.name}
                </p>
              )}

              <p>
                <span className="font-medium">Status:</span> {task.status?.replace('_', ' ').toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;