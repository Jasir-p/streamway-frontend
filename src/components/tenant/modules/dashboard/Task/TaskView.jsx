import React, { useState, useRef } from 'react';
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

// Enhanced mock data with more detailed task information
const initialColumns = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'bg-gray-300',
    tasks: [
      {
        id: 1,
        title: 'Market Research Report',
        description: 'Comprehensive market analysis for Q2 2024',
        priority: 'low',
        status: 'Not Started',
        client: 'Strategic Insights Inc.',
        project: 'Market Intelligence',
        assignees: [
          { id: 1, name: 'Emily Chen', role: 'Research Analyst',  }
        ],
        dueDate: '2024-06-15',
        timeEstimate: '40h',
        tags: ['Research', 'Strategy'],
        subtasks: [
          { id: 1, title: 'Competitor Analysis', completed: false },
          { id: 2, title: 'Customer Interviews', completed: false }
        ]
      }
    ]
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: 'bg-blue-300',
    tasks: [
      {
        id: 2,
        title: 'Enterprise CRM Implementation',
        description: 'Full-scale CRM system rollout and integration',
        priority: 'high',
        status: 'In Progress',
        client: 'Global Tech Solutions',
        project: 'Digital Transformation',
        assignees: [
          { id: 2, name: 'Michael Rodriguez', role: 'Senior Consultant', avatar: 'https://via.placeholder.com/150' },
          { id: 3, name: 'Sarah Lindholm', role: 'Tech Lead', avatar: 'https://via.placeholder.com/150' }
        ],
        dueDate: '2024-05-30',
        timeEstimate: '120h',
        tags: ['CRM', 'Implementation'],
        subtasks: [
          { id: 1, title: 'System Configuration', completed: true },
          { id: 2, title: 'Data Migration', completed: false },
          { id: 3, title: 'User Training', completed: false }
        ]
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-yellow-300',
    tasks: [
      {
        id: 3,
        title: 'Financial Compliance Audit',
        description: 'Detailed financial systems and processes review',
        priority: 'urgent',
        status: 'Pending Review',
        client: 'Global Banking Solutions',
        project: 'Risk Management',
        assignees: [
          { id: 4, name: 'David Kim', role: 'Risk Consultant', avatar: 'https://via.placeholder.com/150' },
          { id: 5, name: 'Anna Patel', role: 'Compliance Specialist', avatar: 'https://via.placeholder.com/150' }
        ],
        dueDate: '2024-04-25',
        timeEstimate: '80h',
        tags: ['Finance', 'Compliance'],
        subtasks: [
          { id: 1, title: 'Initial Assessment', completed: true },
          { id: 2, title: 'Detailed Report', completed: false }
        ]
      }
    ]
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'bg-green-300',
    tasks: [
      {
        id: 4,
        title: 'Omnichannel Strategy Delivery',
        description: 'Integrated retail experience transformation',
        priority: 'low',
        status: 'Completed',
        client: 'RetailMax Enterprises',
        project: 'Digital Strategy',
        assignees: [
          { id: 6, name: 'Jessica Wong', role: 'Principal Consultant', avatar: 'https://via.placeholder.com/150' }
        ],
        dueDate: '2024-03-20',
        timeEstimate: '60h',
        tags: ['Retail', 'Strategy'],
        subtasks: [
          { id: 1, title: 'Strategy Development', completed: true },
          { id: 2, title: 'Executive Presentation', completed: true }
        ]
      }
    ]
  }
];

const TaskManagement = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [viewMode, setViewMode] = useState('board');
  const [selectedTask, setSelectedTask] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-200 text-red-900'
    };
  

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const TaskCard = ({ task, columnId }) => {
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = task.subtasks.length;

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
            <p className="text-xs text-gray-500 mb-2">{task.project}</p>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={16} />
          </button>
        </div>
        
        <p className="text-xs text-gray-600 mb-3">{task.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            {renderPriorityBadge(task.priority)}
            {task.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center -space-x-2">
            {task.assignees.map((assignee) => (
              <img 
                key={assignee.id} 
                src={userprofile} 
                alt={assignee.name} 
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock size={12} />
            <span>{task.timeEstimate}</span>
            <Calendar size={12} />
            <span>{task.dueDate}</span>
          </div>
          <div className="text-xs">
            {completedSubtasks}/{totalSubtasks} subtasks
          </div>
        </div>
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
  const [showTaskForm, setShowTaskForm] = useState(false)
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
          
          return {
            ...column,
            tasks: [...column.tasks, movedTask]
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
            <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search projects, tasks, clients"
                className="pl-8 pr-3 py-2 border rounded-lg text-sm w-72"
              />
              <Search 
                size={16} 
                className="absolute left-2 top-3 text-gray-400" 
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700" onClick ={handleAddTask}>
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

        {/* Project Columns with Drag and Drop */}
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
                <button className="text-gray-500 hover:text-gray-700">
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

        {/* Task Detail Modal (Placeholder) */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedTask.title}</h2>
                <button onClick={() => setSelectedTask(null)} className="text-gray-500">
                  <MoreHorizontal size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedTask.description}</p>
              {/* Add more detailed task information here */}
            </div>
          </div>
           
        )}
           
        <div>
        {showTaskForm && <TaskForm/>}
        </div>
      </div>
    </DashboardLayout>
  );
};


export default TaskManagement;