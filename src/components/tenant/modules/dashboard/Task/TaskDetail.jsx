import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AttachmentViewer from './Attachment';
import { taskChange } from '../../../../../Intreceptors/ActivityApiHandle';

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
    confirmAction.onConfirm?.();
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
const PriorityBadge = ({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority?.toLowerCase()] || PRIORITY_COLORS.medium;
  const displayText = priority?.charAt(0).toUpperCase() + priority?.slice(1).toLowerCase();

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayText}
    </span>
  );
};

const ConfirmationDialog = ({ confirmAction, onConfirm, onCancel }) => {
  if (!confirmAction.show) return null;

  return (
    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <p className="text-yellow-700 mb-2">{confirmAction.message}</p>
      <div className="flex space-x-2">
        <button
          onClick={onConfirm}
          className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const DetailField = ({ label, children, onClick }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <div onClick={onClick} className={onClick ? "cursor-pointer hover:text-blue-600" : ""}>
      {children}
    </div>
  </div>
);

const PersonInfo = ({ person, showRole = true, onClick }) => {
  if (!person) return <span className="text-sm">Unassigned</span>;

  return (
    <p className={`text-sm font-medium ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {person.name}
      {showRole && person.role && <> ({person.role.name})</>}
    </p>
  );
};

const TaskDetailView = ({ task, onClose, onDelete, onChange }) => {
  const role = useSelector(state => state.auth.role);
  const navigate = useNavigate();
  const {
    confirmAction,
    showConfirmation,
    hideConfirmation,
    executeConfirmation
  } = useConfirmAction();

  // Memoized values
  const isOwner = useMemo(() => role === 'owner', [role]);
  const primaryAssignee = useMemo(() => task.assignees?.[0], [task.assignees]);
  const formattedDates = useMemo(() => ({
    created: new Date(task.created_at).toLocaleString(),
    updated: new Date(task.updated_at).toLocaleString()
  }), [task.created_at, task.updated_at]);

  // Navigation handlers
  const handleNavigation = useCallback((type, id) => {
    const route = NAVIGATION_ROUTES[type](id);
    navigate(route);
    onClose();
  }, [navigate, onClose]);

  const navigationHandlers = useMemo(() => ({
    viewLead: () => task.lead && handleNavigation('lead', task.lead.lead_id),
    viewAccount: () => task.account && handleNavigation('account', task.account.id),
    viewContact: () => task.contact && handleNavigation('contact'),
    viewAssignee: () => primaryAssignee && isOwner && handleNavigation('user'),
    editTask: () => handleNavigation('edit', task.id)
  }), [task, primaryAssignee, isOwner, handleNavigation]);

  // Status and action handlers
  const handleStatusChange = useCallback(async (newStatus) => {
    try {
      const response = await taskChange(task.id, { status: newStatus });
      console.log("Status updated:", response.data);
      onClose();
      onChange();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }, [task.id, onClose, onChange]);

  const handleDeleteTask = useCallback(() => {
    onDelete(task.id);
    onClose();
  }, [onDelete, task.id, onClose]);

  const actionHandlers = useMemo(() => ({
    confirmStatusChange: (status) => showConfirmation(
      `Change status to "${status}"?`, 
      () => handleStatusChange(status)
    ),
    confirmDelete: () => showConfirmation(
      "Are you sure you want to delete this task?", 
      handleDeleteTask
    )
  }), [showConfirmation, handleStatusChange, handleDeleteTask]);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <div className="flex space-x-2">
            <button 
              className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
              onClick={navigationHandlers.editTask}
            >
              Edit
            </button>
            <button 
              className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
              onClick={actionHandlers.confirmDelete}
            >
              Delete
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Confirmation Dialog */}
        <ConfirmationDialog 
          confirmAction={confirmAction}
          onConfirm={executeConfirmation}
          onCancel={hideConfirmation}
        />

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-700">{task.description || 'No description provided.'}</p>
          </div>
          
          {/* Details Panel */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
            
            <div className="space-y-3">
              {/* Status */}
              <DetailField label="Status">
                <p className="text-sm font-medium">{task.status}</p>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  value={task.status}
                  onChange={(e) => actionHandlers.confirmStatusChange(e.target.value)}
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </DetailField>

              {/* Priority */}
              <DetailField label="Priority">
                <PriorityBadge priority={task.priority} />
              </DetailField>

              {/* Assignee */}
              <DetailField label="Assignee">
                <PersonInfo 
                  person={primaryAssignee}
                  onClick={isOwner ? navigationHandlers.viewAssignee : undefined}
                />
              </DetailField>

              {/* Created By */}
              <DetailField label="Created By">
                <PersonInfo person={task.created_by} />
              </DetailField>

              {/* Assigned By */}
              {task.assigned_by && (
                <DetailField label="Assigned By">
                  <PersonInfo person={task.assigned_by} />
                </DetailField>
              )}

              {/* Dates */}
              <DetailField label="Created">
                <p className="text-sm">{formattedDates.created}</p>
              </DetailField>

              <DetailField label="Last Updated">
                <p className="text-sm">{formattedDates.updated}</p>
              </DetailField>

              {/* Related Entities */}
              {task.lead && (
                <DetailField label="Lead" onClick={navigationHandlers.viewLead}>
                  <p className="text-sm font-medium">{task.lead.lead_id}</p>
                </DetailField>
              )}

              {task.contact && (
                <DetailField label="Contact" onClick={navigationHandlers.viewContact}>
                  <p className="text-sm font-medium">{task.contact.name}</p>
                </DetailField>
              )}

              {task.account && (
                <DetailField label="Account" onClick={navigationHandlers.viewAccount}>
                  <p className="text-sm font-medium">{task.account.name}</p>
                </DetailField>
              )}
            </div>
          </div>
        </div>
        
        {/* Subtasks */}
        {task.subtasks?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Subtasks</h3>
            <ul className="space-y-2">
              {task.subtasks.map(subtask => (
                <li key={subtask.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={subtask.completed} 
                    className="mr-2"
                    readOnly
                  />
                  <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                    {subtask.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Attachments */}
        <AttachmentViewer selectedTask={task} />

        {/* Activity */}
        <div>
              <h3 className="text-md font-semibold mb-2">Activity</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Task created by{' '}
                  {task.created_by?.name || 'Owner'} on {formattedDates.created}
                </p>

                {task.assigned_by && (
                  <p>
                    Task assigned by {task.assigned_by?.name || 'Unknown'}
                  </p>
                )}

                {primaryAssignee && (
                  <p>
                    Currently assigned to {primaryAssignee.name}
                  </p>
                )}
              </div>
            </div>

      </div>
    </div>
  );
};

export default TaskDetailView;