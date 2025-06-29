import { useState } from 'react';
import TaskDetailView from '../../dashboard/Task/TaskDetail';
const TabContent = ({ activeTab, team, members, activities, tasks, }) => {

  console.log(tasks);
  

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return 'bg-green-100 text-green-800';
      case false:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  if (activeTab === 'overview') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
        <p className="mt-4 text-gray-600">
          This is an overview of your team's performance, tasks, and achievements.
        </p>
        {team.description && (
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-800">Team Description</h4>
            <p className="mt-2 text-gray-600">{team.description}</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'members') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
        <ul className="mt-4 space-y-4">
        {members?.length > 0 ? (
          members.map((member) => (
            <li key={member.id} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-full w-full object-cover rounded-full" 
                  />
                ) : (
                  <span>{member.name ? member.name.split(' ').map(n => n[0]).join('') : 'U'}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{member.role?.name || 'No position'}</p>
                <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(member.is_active)}`}>
                  {member.is_active?'active':'inactive' || 'Unknown'}
                </span>
              </div>
              
            </li>
          ))
        ) : (
          <li className="text-center py-4 text-gray-500">No members found</li>
        )}
      </ul>
      </div>
    );
  }

  if (activeTab === 'tasks') {
    return (
      <>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900">Team Tasks</h3>
          <div className="mt-4 space-y-4">
            {tasks?.length > 0 ? (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{task.name || task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Assigned to:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {task.assigned_to_employee.name || task.assignee?.name || 'Unassigned'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Due:</span>
                          <span className="text-sm text-gray-900">{formatDate(task.duedate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTaskStatusColor(task.status)}`}>
                        {task.status || 'Pending'}
                      </span>
                      {task.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tasks found for this team
              </div>
            )}
          </div>
        </div>

       
        
                      
                    
      </>
    );
  }

  return null;
};

export default TabContent;