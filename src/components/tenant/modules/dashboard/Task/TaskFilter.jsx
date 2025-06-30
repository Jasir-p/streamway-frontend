import React, { useState, useEffect } from 'react';
import {
  Filter, ChevronDown, X, Users, AlertCircle,
  CheckCircle, Clock, Flag, User
} from 'lucide-react';

const TaskFilters = ({
  onFiltersChange,
  tasks = [],
  teams = [],
  users = [],
  initialFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priorities: [],
    statuses: [],
    assignedUsers: [],
    assignedTeams: [],
    ...initialFilters
  });

  const priorities = [
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-700', icon: Flag },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: Flag },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700', icon: Flag },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700', icon: AlertCircle }
  ];

  const statuses = [
    { value: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-700', icon: Clock },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
    { value: 'REVIEW', label: 'Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  ];

  const availableUsers = users.length > 0 ? users : getUniqueUsersFromTasks(tasks);
  const availableTeams = teams.length > 0 ? teams : getUniqueTeamsFromTasks(tasks);

  function getUniqueUsersFromTasks(tasks) {
    const userSet = new Set();
    const users = [];

    tasks.forEach(task => {
      task.assignees?.forEach(assignee => {
        if (assignee.role !== 'Team' && !userSet.has(assignee.id)) {
          userSet.add(assignee.id);
          users.push({
            id: assignee.id,
            name: assignee.name,
            role: assignee.role?.name
          });
        }
      });
    });

    return users;
  }

  function getUniqueTeamsFromTasks(tasks) {
    const teamSet = new Set();
    const teams = [];

    tasks.forEach(task => {
      const team = task.assigned_to_team;
      if (team && !teamSet.has(team.id)) {
        teamSet.add(team.id);
        teams.push({ id: team.id, name: team.name });
      }
    });

    return teams;
  }

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (type, value, isChecked) => {
    setFilters(prev => ({
      ...prev,
      [type]: isChecked
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({ priorities: [], statuses: [], assignedUsers: [], assignedTeams: [] });
  };

  const clearFilterType = (type) => {
    setFilters(prev => ({ ...prev, [type]: [] }));
  };

  const getActiveFiltersCount = () => (
    filters.priorities.length +
    filters.statuses.length +
    filters.assignedUsers.length +
    filters.assignedTeams.length
  );

  const FilterCheckbox = ({ checked, onChange, children, color }) => (
    <label className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer ${color || ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      {children}
    </label>
  );

  const FilterSection = ({ title, icon: Icon, children, onClear, hasItems }) => (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        </div>
        {hasItems && (
          <button onClick={onClear} className="text-xs text-blue-600 hover:underline">Clear</button>
        )}
      </div>
      <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-100 transition ${
          getActiveFiltersCount() > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <Filter size={16} />
        <span>Filters</span>
        {getActiveFiltersCount() > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
            {getActiveFiltersCount()}
          </span>
        )}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 max-h-[80vh] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 scrollbar-thin scrollbar-thumb-gray-300">

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Filter Tasks</h3>
              <div className="flex items-center gap-2">
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Priority Filter */}
            <FilterSection
              title="Priority"
              icon={Flag}
              onClear={() => clearFilterType('priorities')}
              hasItems={filters.priorities.length > 0}
            >
              {priorities.map(priority => (
                <FilterCheckbox
                  key={priority.value}
                  checked={filters.priorities.includes(priority.value)}
                  onChange={(e) => handleFilterChange('priorities', priority.value, e.target.checked)}
                  color={filters.priorities.includes(priority.value) ? priority.color : ''}
                >
                  <priority.icon size={12} className="text-current" />
                  <span className="text-xs">{priority.label}</span>
                </FilterCheckbox>
              ))}
            </FilterSection>

            {/* Status Filter */}
            <FilterSection
              title="Status"
              icon={CheckCircle}
              onClear={() => clearFilterType('statuses')}
              hasItems={filters.statuses.length > 0}
            >
              {statuses.map(status => (
                <FilterCheckbox
                  key={status.value}
                  checked={filters.statuses.includes(status.value)}
                  onChange={(e) => handleFilterChange('statuses', status.value, e.target.checked)}
                  color={filters.statuses.includes(status.value) ? status.color : ''}
                >
                  <status.icon size={12} className="text-current" />
                  <span className="text-xs">{status.label}</span>
                </FilterCheckbox>
              ))}
            </FilterSection>

            {/* Assigned Users Filter */}
            {availableUsers.length > 0 && (
              <FilterSection
                title="Assigned to User"
                icon={User}
                onClear={() => clearFilterType('assignedUsers')}
                hasItems={filters.assignedUsers.length > 0}
              >
                {availableUsers.map(user => (
                  <FilterCheckbox
                    key={user.id}
                    checked={filters.assignedUsers.includes(user.id)}
                    onChange={(e) => handleFilterChange('assignedUsers', user.id, e.target.checked)}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{user.name}</span>
                      <span className="text-[10px] text-gray-500">{user.role}</span>
                    </div>
                  </FilterCheckbox>
                ))}
              </FilterSection>
            )}

            {/* Assigned Teams Filter */}
            {availableTeams.length > 0 && (
              <FilterSection
                title="Assigned to Team"
                icon={Users}
                onClear={() => clearFilterType('assignedTeams')}
                hasItems={filters.assignedTeams.length > 0}
              >
                {availableTeams.map(team => (
                  <FilterCheckbox
                    key={team.id}
                    checked={filters.assignedTeams.includes(team.id)}
                    onChange={(e) => handleFilterChange('assignedTeams', team.id, e.target.checked)}
                  >
                    <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <Users size={10} />
                    </div>
                    <span className="text-xs font-medium">{team.name}</span>
                  </FilterCheckbox>
                ))}
              </FilterSection>
            )}

            {/* Empty message */}
            {availableUsers.length === 0 && availableTeams.length === 0 && (
              <div className="text-center py-3 text-gray-500 text-xs">
                <Users size={20} className="mx-auto mb-1 opacity-50" />
                <p>No assignees available to filter</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Apply Filters Helper
export const applyTaskFilters = (tasks, filters) => {
  if (!tasks || tasks.length === 0) return [];

  return tasks.filter(task => {
    if (filters.priorities?.length > 0 && !filters.priorities.includes(task.priority)) return false;
    if (filters.statuses?.length > 0 && !filters.statuses.includes(task.status)) return false;

    if (filters.assignedUsers?.length > 0) {
      const taskUserIds = task.assignees?.filter(a => a.role !== 'Team').map(a => a.id) || [];
      if (!filters.assignedUsers.some(id => taskUserIds.includes(id))) return false;
    }

    if (filters.assignedTeams?.length > 0) {
      if (!task.assigned_to_team || !filters.assignedTeams.includes(task.assigned_to_team.id)) return false;
    }

    return true;
  });
};

export default TaskFilters;
