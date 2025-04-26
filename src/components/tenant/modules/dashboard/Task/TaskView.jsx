import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  List, 
  Grid, 
  MoreHorizontal, 
  Search, 
  ChevronDown,
  Briefcase,
  Calendar,
  Tag,
  CheckCircle,
  AlertTriangle,
  Move,
  Columns,
  Users,
  Clock
} from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import userprofile from "../../../../../assets/user-profile.webp";
import TaskForm from './TaskForm';
import { fetchTask } from '../../../../../redux/slice/TaskSlice';
import { useSelector, useDispatch } from 'react-redux';
import AttachmentViewer from './Attachment';


// Initial column structure - will be populated with API data
const initialColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-gray-300',
    tasks: []
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: 'bg-blue-300',
    tasks: []
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-yellow-300',
    tasks: []
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'bg-green-300',
    tasks: []
  }
];

// Map API status to column IDs
const mapStatusToColumnId = (status) => {
  switch (status) {
    case 'TODO': return 'backlog';
    case 'IN_PROGRESS': return 'in_progress';
    case 'REVIEW': return 'review';
    case 'DONE': return 'completed';
    default: return 'backlog';
  }
};

const TaskManagement = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [viewMode, setViewMode] = useState('board');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  
  const { tasks, loading, error } = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  // Fetch tasks from API on component mount
  useEffect(() => {
    dispatch(fetchTask());
  }, [dispatch]);

  // Process tasks when they arrive from API
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Create a new columns structure based on API data
      const newColumns = [...initialColumns].map(col => ({...col, tasks: []}));
      
      // Distribute tasks to appropriate columns
      tasks.forEach(task => {
        const columnId = mapStatusToColumnId(task.status);
        const columnIndex = newColumns.findIndex(col => col.id === columnId);
        
        if (columnIndex !== -1) {

          const uiTask = {
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority.toLowerCase(),
            status: task.status,
            client: task.account || 'Not assigned',
            project: task.lead || 'Not assigned',
            assignees: [
              { id: task.assigned_to_employee, name: task.assigned_to_employee.name, role: task.assigned_to_employee.role }
            ],
            dueDate: task.created_at ? task.created_at.split('T')[0] : 'Not set',
            timeEstimate: '1h', // Default value
            tags: [task.priority.toLowerCase()], 
            subtasks: [],
            attachment:task.attachment,
            created_at: task.created_at,
            updated_at: task.updated_at,
            assigned_by: task.assigned_by
          };
          
          newColumns[columnIndex].tasks.push(uiTask);
        }
      });
      
      setColumns(newColumns);
    }
  }, [tasks]);

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-200 text-red-900',
      // Map your API priority values (assuming they're uppercase)
      'HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800'
    };
  
    // Handle case sensitivity
    const priorityKey = priority.toLowerCase();
    const colorClass = priorityColors[priorityKey] || priorityColors['medium'];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {priority?.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
      </span>
    );
  };

  const TaskCard = ({ task, columnId }) => {
    const completedSubtasks = task.subtasks ? task.subtasks.filter(subtask => subtask.completed).length : 0;
    const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

    const handleTaskClick = () => {
      setSelectedTask(task);
    };

    return (
      <div 
        onClick={handleTaskClick}
        className="bg-white shadow-md rounded-lg p-4 mb-3 hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{task.title}</h3>
            <p className="text-xs text-gray-500 mb-2">
              {task.lead ? `Lead: ${task.lead}` : task.project}
            </p>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={16} />
          </button>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            {renderPriorityBadge(task.priority)}
            {task.tags && task.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center -space-x-2">
            {task.assignees && task.assignees.map((assignee) => (
              <div 
                key={assignee.id} 
                className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                title={`Assigned to: ${assignee.name}`}
              >
                {assignee?.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
        
        {totalSubtasks > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock size={12} />
                <span>{task.timeEstimate || 'N/A'}</span>
                <Calendar size={12} />
                <span>{task.dueDate || 'N/A'}</span>
              </div>
              <div className="text-xs">
                {completedSubtasks}/{totalSubtasks} subtasks
              </div>
            </div>
          </>
        )}
        
        {totalSubtasks === 0 && (
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar size={12} />
              <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            <div className="text-xs">
              Assigned by: #{task.assigned_by}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleDragStart = (e, taskId, columnId) => {
    dragItem.current = { taskId, columnId };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetColumnId) => {
    e.preventDefault();
    dragOverItem.current = targetColumnId;
  };

  const handleAddTask = () => {
    setShowTaskForm(true);
  };
    
  const closeTaskForm = () => {
    setShowTaskForm(false);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const sourceColumnId = dragItem.current.columnId;
    const taskId = dragItem.current.taskId;

    if (sourceColumnId !== targetColumnId) {
      // Map column IDs back to API status values
      const getStatusFromColumnId = (colId) => {
        switch (colId) {
          case 'backlog': return 'TODO';
          case 'in_progress': return 'IN_PROGRESS';
          case 'review': return 'REVIEW';
          case 'completed': return 'DONE';
          default: return 'TODO';
        }
      };

      const newColumns = columns.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
          };
        }
        if (column.id === targetColumnId) {
          const movedTask = columns
            .find(col => col.id === sourceColumnId)
            .tasks.find(task => task.id === taskId);
          
          // Update task status based on new column
          const updatedTask = {
            ...movedTask,
            status: getStatusFromColumnId(targetColumnId)
          };

          
          return {
            ...column,
            tasks: [...column.tasks, updatedTask]
          };
        }
        return column;
      });

      setColumns(newColumns);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Briefcase size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search tasks, leads, accounts"
                className="pl-8 pr-3 py-2 border rounded-lg text-sm w-72"
              />
              <Search 
                size={16} 
                className="absolute left-2 top-3 text-gray-400" 
              />
            </div>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700" 
              onClick={handleAddTask}
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Filters and View Modes */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <Filter size={16} />
              <span>Advanced Filters</span>
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <Users size={16} />
              <span>Team View</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-lg ${viewMode === 'board' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('columns')}
              className={`p-2 rounded-lg ${viewMode === 'columns' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <Columns size={16} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <AlertTriangle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <h3 className="font-medium">Error loading tasks</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Project Columns with Drag and Drop */}
        {!loading && !error && viewMode === 'board' && (
          <div className="grid grid-cols-4 gap-4">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className="bg-gray-100 rounded-lg p-4"
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`h-2 w-full ${column.color} rounded-t-lg mb-4`}></div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {column.title} ({column.tasks.length})
                  </h2>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleAddTask}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                    >
                      <TaskCard task={task} columnId={column.id} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && !error && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {columns.flatMap(column => column.tasks).map(task => (
                  <tr key={task.id} onClick={() => setSelectedTask(task)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.lead || task.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPriorityBadge(task.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.assignees && task.assignees.length > 0 
                        ? task.assignees[0].name
                        : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedTask && (
  <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{selectedTask.title}</h2>
        <div className="flex space-x-2">
          <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50">
            Edit
          </button>
          <button 
            onClick={() => setSelectedTask(null)} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
          <p className="text-gray-700">{selectedTask.description || 'No description provided.'}</p>
        </div>
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium">{selectedTask.status}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <div>{renderPriorityBadge(selectedTask.priority)}</div>
              </div>
              
              <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <p className="text-sm font-medium">
                    {selectedTask.assignees && selectedTask.assignees.length > 0 ? (
                      <>
                        {selectedTask.assignees[0].name}
                        {selectedTask.assignees[0].role && (
                          <> ({selectedTask.assignees[0].role.name})</>
                        )}
                      </>
                    ) : (
                      'Unassigned'
                    )}
                  </p>
                </div>

              
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm">{new Date(selectedTask.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm">{new Date(selectedTask.updated_at).toLocaleString()}</p>
              </div>
              
              {selectedTask.lead && (
                <div>
                  <p className="text-xs text-gray-500">Lead</p>
                  <p className="text-sm font-medium">{selectedTask.lead}</p>
                </div>
              )}
              
              {selectedTask.account && (
                <div>
                  <p className="text-xs text-gray-500">Account</p>
                  <p className="text-sm font-medium">{selectedTask.account}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Subtasks</h3>
          <ul className="space-y-2">
            {selectedTask.subtasks.map(subtask => (
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
       */}

      <AttachmentViewer selectedTask={selectedTask} />
      

      <div>
        <h3 className="text-md font-semibold mb-2">Activity</h3>
        <div className="text-sm text-gray-600">
          <p>Task created by #{selectedTask.assigned_by} on {new Date(selectedTask.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
)}
           
        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-1/2 max-h-[80vh] overflow-y-auto my-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Task</h2>
                <button 
                  onClick={closeTaskForm} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <TaskForm onClose={closeTaskForm} />
            </div>
          </div>
)}
      </div>
    </DashboardLayout>
  );
};

export default TaskManagement;