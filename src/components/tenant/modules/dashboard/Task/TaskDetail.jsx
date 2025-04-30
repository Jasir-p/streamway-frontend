import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AttachmentViewer from './Attachment';

const TaskDetailView = ({ task, onClose, onDelete }) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  console.log(task);
  

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-200 text-red-900',
      'HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
  
    const priorityKey = priority.toLowerCase();
    const colorClass = priorityColors[priorityKey] || priorityColors['medium'];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {priority?.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const handleViewLead = () => {
    if (task.lead) {
      navigate(`/dashboard/sale/leads/${task.lead.lead_id}`);
      onClose();
    }
  };

  const handleViewAccount = () => {
    if (task.account) {
      navigate(`/dashboard/accounts/${task.account_id}`);
      onClose();
    }
  };
  const handleViewContact =()=>{
    if (task.contact) {
        navigate(`/dashboard/customer/contacts`);
        onClose();
      }
  }

  const handleViewAssignee = (assigneeId) => {
    if (assigneeId) {
      navigate(`/setting/users`);
      onClose();
    }
  };

  const handleDeleteConfirm = () => {
    setConfirmDelete(true);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  const handleDeleteTask = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <div className="flex space-x-2">
            <button 
              className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
              onClick={() => navigate(`/dashboard/tasks/edit/${task.id}`)}
            >
              Edit
            </button>
            <button 
              className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
              onClick={handleDeleteConfirm}
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
        
        {confirmDelete && (
          <div className="mb-4 bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-700 mb-2">Are you sure you want to delete this task?</p>
            <div className="flex space-x-2">
              <button 
                onClick={handleDeleteTask}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
              <button 
                onClick={handleDeleteCancel}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-700">{task.description || 'No description provided.'}</p>
          </div>
          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium">{task.status}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Priority</p>
                  <div>{renderPriorityBadge(task.priority)}</div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <p className="text-sm font-medium cursor-pointer hover:text-blue-600" 
                     onClick={() => task.assignees && task.assignees.length > 0 && handleViewAssignee(task.assignees[0].id)}>
                    {task.assignees && task.assignees.length > 0 ? (
                      <>
                        {task.assignees[0].name}
                        {task.assignees[0].role && (
                          <> ({task.assignees[0].role.name})</>
                        )}
                      </>
                    ) : (
                      'Unassigned'
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm">{new Date(task.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm">{new Date(task.updated_at).toLocaleString()}</p>
                </div>
                
                {task.lead && (
                  <div>
                    <p className="text-xs text-gray-500">Lead</p>
                    <p className="text-sm font-medium cursor-pointer hover:text-blue-600" 
                       onClick={handleViewLead}>
                      {task.lead.lead_id}
                    </p>
                  </div>
                )}
                {task.contact && (
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium cursor-pointer hover:text-blue-600" 
                       onClick={handleViewContact}>
                      {task.contact.name}
                    </p>
                  </div>
                )}
                
                {task.account && (
                  <div>
                    <p className="text-xs text-gray-500">Account</p>
                    <p className="text-sm font-medium cursor-pointer hover:text-blue-600" 
                       onClick={handleViewAccount}>
                      {task.account}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {task.subtasks && task.subtasks.length > 0 && (
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

        <AttachmentViewer selectedTask={task} />

        <div>
          <h3 className="text-md font-semibold mb-2">Activity</h3>
          <div className="text-sm text-gray-600">
            <p>Task created by #{task.assigned_by} on {new Date(task.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;