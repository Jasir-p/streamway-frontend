import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, List, Grid, MoreHorizontal, Search, 
  Briefcase, Calendar, Tag, CheckCircle, 
  AlertTriangle, Columns, Users, Edit, Trash
} from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import TaskForm from './TaskForm';
import TaskDetailView from './TaskDetail';
import TaskFilters from './TaskFilter';
import { fetchTask, deleteTask } from '../../../../../redux/slice/TaskSlice';
import { useSelector, useDispatch } from 'react-redux';
import DashbordLoading from '../../../../common/DashbordLoading';
import { useTaskPermissions } from '../../../authorization/useTaskPermissions';
import { useDebounce } from '../../../../../hooks/useDebounce';

const initialColumns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-300', tasks: [] },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-300', tasks: [] },
  { id: 'review', title: 'Review', color: 'bg-yellow-300', tasks: [] },
  { id: 'completed', title: 'Completed', color: 'bg-green-300', tasks: [] }
];

const mapStatusToColumnId = (status) => {
  const statusMap = { 
    'TODO': 'backlog', 
    'IN_PROGRESS': 'in_progress', 
    'REVIEW': 'review', 
    'COMPLETED': 'completed' 
  };
  return statusMap[status] || 'backlog';
};

const getStatusFromColumnId = (colId) => {
  const colMap = { 
    'backlog': 'TODO', 
    'in_progress': 'IN_PROGRESS', 
    'review': 'REVIEW', 
    'completed': 'COMPLETED' 
  };
  return colMap[colId] || 'TODO';
};

const TaskManagement = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [viewMode, setViewMode] = useState('board');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredColumns, setFilteredColumns] = useState(initialColumns);
  const [showDetailView, setShowDetailView] = useState(false);
  const [change, setChange] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [activeFilters, setActiveFilters] = useState({
    priorities: [],
    statuses: [],
    assignedUsers: [],
    assignedTeams: []
  });
  
  const dragItem = useRef(null);
  
  const role = useSelector((state) => state.auth.role);
  const userID = useSelector((state) => state.profile.id);
  const {canAdd,canEdit,canDelete}=useTaskPermissions()
  const { tasks, loading, error, next, previous } = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const handleChange = () => setChange(prev => !prev);

  // Fetch tasks
  useEffect(() => {
    const params = {
      role,
      userID,
      search: debouncedSearchQuery
    };
    if (activeFilters.priorities.length > 0) {
      params.priority = activeFilters.priorities.join(',');
    }
    
    if (activeFilters.statuses.length > 0) {
      params.status = activeFilters.statuses.join(',');
    };
    dispatch(fetchTask(params));
  }, [dispatch, change, userID, role,debouncedSearchQuery,activeFilters]);

  const convertTasksToUIFormat = (tasks) => {
    if (!tasks) return [];
    
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority || 'MEDIUM',
      status: task.status,
      client: task.account || 'Not assigned',
      account: task.account,
      account_id: task.account_id,
      contact: task.contact,
      contact_id: task.contact_id,
      lead: task.lead,
      lead_id: task.lead_id,
      is_team: task.is_team || false,
      assignees: [
        ...(task.assigned_to_employee ? [{ 
          id: task.assigned_to_employee.id, 
          name: task.assigned_to_employee.name, 
          role: task.assigned_to_employee.role 
        }] : []),
        ...(task.assigned_to_team ? [{ 
          id: task.assigned_to_team.id, 
          name: task.assigned_to_team.name, 
          role: 'Team' 
        }] : [])
      ],
      dueDate: task.created_at ? task.created_at.split('T')[0] : 'Not set',
      timeEstimate: '1h',
      tags: [task.priority ? task.priority.toLowerCase() : 'medium'],
      subtasks: task.subtasks || [],
     
      created_by: task.created_by ? { 
        id: task.created_by.id, 
        name: task.created_by.name, 
        role: task.created_by.role 
      } : null,
      assigned_by: task.assigned_by ? { 
        id: task.assigned_by.id, 
        name: task.assigned_by.name, 
        role: task.assigned_by.role 
      } : null,
      assigned_to_team: task.assigned_to_team ? { 
        id: task.assigned_to_team.id, 
        name: task.assigned_to_team.name 
      } : null,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));
  };

  // Update columns when tasks change
  useEffect(() => {
    if (tasks?.length > 0) {
      const uiTasks = convertTasksToUIFormat(tasks);
      const newColumns = initialColumns.map(col => ({ ...col, tasks: [] }));
      
      uiTasks.forEach(task => {
        const columnId = mapStatusToColumnId(task.status);
        const columnIndex = newColumns.findIndex(col => col.id === columnId);
        
        if (columnIndex !== -1) {
          newColumns[columnIndex].tasks.push(task);
        }
      });
      
      setColumns(newColumns);
    } else {
      setColumns(initialColumns);
    }
  }, [tasks, change]);

  // Apply filters and search


  // Handle filter changes
  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800', 
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800', 
      urgent: 'bg-red-200 text-red-900',
      'HIGH': 'bg-orange-100 text-orange-800', 
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800', 
      'URGENT': 'bg-red-200 text-red-900'
    };
    const priorityKey = priority ? priority.toString().toLowerCase() : 'medium';
    const colorClass = priorityColors[priorityKey] || priorityColors['medium'];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {priority ? priority.toString().charAt(0).toUpperCase() + priority.toString().slice(1).toLowerCase() : 'Medium'}
      </span>
    );
  };

  const TaskCard = ({ task, columnId }) => {
    const handleTaskClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedTask(task);
      setShowDetailView(true);
    };

    const handleEditClick = (e) => {
      e.stopPropagation();
      handleEditTask(task);
    };

    return (
      <div onClick={handleTaskClick} className="bg-white shadow-md rounded-lg p-4 mb-3 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{task.title}</h3>
            <p className="text-xs text-gray-500 mb-2">
              {task.lead ? `Lead: ${task.lead.lead_id}` : (task.contact ? `Contact: ${task.contact.name}` : 'No assignment')}
            </p>
          </div>
          {canEdit &&(<button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={handleEditClick}
            type="button"
          >
            <MoreHorizontal size={16} />
          </button>)}
          
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            {renderPriorityBadge(task.priority)}
            {task.tags?.map((tag, index) => (
              tag !== task.priority?.toString()?.toLowerCase() && (
                <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">{tag}</span>
              )
            ))}
          </div>
          
          <div className="flex items-center -space-x-2">
            {task.assignees?.map((assignee) => (
              <div 
                key={assignee.id} 
                className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-medium border-2 border-white ${
                  assignee.role === 'Team' ? 'bg-purple-500' : 'bg-blue-500'
                }`} 
                title={`Assigned to: ${assignee?.name || 'Unknown'}`}
              >
                {assignee.role === 'Team' ? (
                  <Users size={10} />
                ) : (
                  assignee?.name ? assignee.name.charAt(0) : '?'
                )}
              </div>
            ))}
          </div>
        </div>
        
        
      </div>
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e, taskId, columnId) => {
    dragItem.current = { taskId, columnId };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    
    if (!dragItem.current) return;
    
    const sourceColumnId = dragItem.current.columnId;
    const taskId = dragItem.current.taskId;

    if (sourceColumnId !== targetColumnId) {
      const sourceColumn = columns.find(col => col.id === sourceColumnId);
      const movedTask = sourceColumn.tasks.find(task => task.id === taskId);
      const newStatus = getStatusFromColumnId(targetColumnId);
      
      const newColumns = columns.map(column => {
        if (column.id === sourceColumnId) {
          return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
        }
        if (column.id === targetColumnId) {
          const updatedTask = { ...movedTask, status: newStatus };
          return { ...column, tasks: [...column.tasks, updatedTask] };
        }
        return column;
      });

      setColumns(newColumns);
    }
    
    dragItem.current = null;
  };

  // Task actions
  const handleAddTask = () => {
    setIsEditingTask(false);
    setTaskToEdit(null);
    setShowTaskForm(true);
  };

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
    setIsEditingTask(false);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsEditingTask(true);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      dispatch(fetchTask({ role, userID }));
      setSelectedTask(null);
      setShowDetailView(false);
    } catch (error) {
      
    }
  };

  const closeTaskDetailView = () => {
    setSelectedTask(null);
    setShowDetailView(false);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowDetailView(true);
  };

  const handleNextTask = () => {
    if (next) {
      dispatch(fetchTask({ role, userID, url: next }));
    }
  };

  const handlePrevTask = () => {
    if (previous) {
      dispatch(fetchTask({ role, userID, url: previous }));
    }
  };

  const hasAnyTasks = columns.some(column => column.tasks.length > 0);
  const allTasks = columns.flatMap(column => column.tasks);

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
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <Search size={16} className="absolute left-2 top-3 text-gray-400" />
            </div>
            {canAdd &&(<button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700" 
              onClick={handleAddTask}
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>)}
            
          </div>
        </div>

        {/* Filters and View Modes */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TaskFilters
              tasks={allTasks}
              onFiltersChange={handleFiltersChange}
              initialFilters={activeFilters}
            />
          </div>
          <div className="flex items-center space-x-2">
            {['list', 'board',].map(mode => (
              <button 
                key={mode} 
                onClick={() => setViewMode(mode)} 
                className={`p-2 rounded-lg ${viewMode === mode ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                {mode === 'list' ? <List size={16} /> : <Grid size={16} /> }
              </button>
            ))}
          </div>
        </div>

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

        {/* Empty State */}
        {!error && !hasAnyTasks && (
          <div className="bg-white rounded-lg p-8 text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Tag size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || Object.values(activeFilters).some(arr => arr.length > 0) 
                ? "No tasks match your search criteria or filters." 
                : "You haven't created any tasks yet."}
            </p>
            {canAdd &&(
              <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 hover:bg-blue-700" 
              onClick={handleAddTask}
            >
              <Plus size={16} />
              <span>Create your first task</span>
            </button>
            )}
            
          </div>
        )}

        {/* Board View */}
        {!error && viewMode === 'board' && hasAnyTasks && (
          <div className="grid grid-cols-4 gap-4">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className="bg-gray-100 rounded-lg p-4" 
                onDragOver={handleDragOver} 
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`h-2 w-full ${column.color} rounded-t-lg mb-4`}></div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {column.title} ({column.tasks.length})
                  </h2>
                  {canAdd &&(<button 
                    className="text-gray-500 hover:text-gray-700" 
                    onClick={handleAddTask}
                  >
                    <Plus size={16} />
                  </button>)}
                  
                </div>
                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
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
        {!error && viewMode === 'list' && hasAnyTasks && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Priority', 'Status', 'Assignee', 'Created', 'Actions'].map(header => (
                    <th 
                      key={header} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {columns.flatMap(column => column.tasks).map(task => (
                  <tr 
                    key={task.id} 
                    onClick={() => handleTaskClick(task)} 
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        {task.lead ? `Lead: ${task.lead.lead_id}` : (task.contact ? `Contact: ${task.contact.name}` : 'No assignment')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{renderPriorityBadge(task.priority)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {task.assignees?.slice(0, 2).map((assignee) => (
                          <div 
                            key={assignee.id} 
                            className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-medium ${
                              assignee.role === 'Team' ? 'bg-purple-500' : 'bg-blue-500'
                            }`} 
                            title={`${assignee?.name || 'Unknown'}`}
                          >
                            {assignee.role === 'Team' ? (
                              <Users size={10} />
                            ) : (
                              assignee?.name ? assignee.name.charAt(0) : '?'
                            )}
                          </div>
                        ))}
                        {task.assignees?.length > 2 && (
                          <span className="text-xs text-gray-500">+{task.assignees.length - 2}</span>
                        )}
                        {(!task.assignees || task.assignees.length === 0) && (
                          <span className="text-xs text-gray-400">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canEdit &&(<button 
                        className="text-blue-600 hover:text-blue-900 mr-3" 
                        onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                      >
                        <Edit size={16} />
                      </button>)}
                      {canDelete &&(<button 
                        className="text-red-600 hover:text-red-900" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                           
                            handleDeleteTask(task.id); 
                        }}
                      >
                        <Trash size={16} />
                      </button>)}
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {(next || previous) && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrevTask}
              disabled={!previous}
              className={`px-4 py-2 rounded text-white transition 
                          ${previous ? 'bg-blue-400 hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Previous
            </button>

            <button
              onClick={handleNextTask}
              disabled={!next}
              className={`px-4 py-2 rounded text-white transition 
                          ${next ? 'bg-blue-400 hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Next
            </button>
          </div>
        )}

        {/* Modals */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center ">
            
              <TaskForm 
                onClose={closeTaskForm} 
                task={isEditingTask ? taskToEdit : null} 
                isEditing={isEditingTask} 
                onChange={handleChange}
              />
           
          </div>
        )}

        {selectedTask && showDetailView && (
          
            <div className="bg-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto">
              <TaskDetailView 
                task={selectedTask} 
                onClose={closeTaskDetailView} 
                onDelete={handleDeleteTask} 
                onChange={handleChange}
                canDelete={canDelete} 
              />
            </div>
          
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaskManagement;