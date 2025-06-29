// TaskForm.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';
import { fetchContacts } from '../../../../../redux/slice/contactSlice';
import { fetchAccounts } from '../../../../../redux/slice/AccountsSlice';
import { fetchTeams } from '../../../../../redux/slice/TeamSlice';
import { FormField, PaginationArrows, SelectField, ListManager } from './component/TaskComponents';
import { INITIAL_FORM_DATA, OPTIONS } from './constatnts/taskConstants';
import { useTaskFormHandlers } from './hooks/useTaskFormHandlers';

const TaskForm = ({ onClose, task, isEditing }) => {
  // Redux state
  const { role } = useSelector(state => state.auth);
  const { id: userId } = useSelector(state => state.profile);
  const { leads, next: leadsNext, previous: leadsPrevious } = useSelector(state => state.leads);
  const { contacts } = useSelector(state => state.contacts);
  const { accounts } = useSelector(state => state.accounts);
  const teams = useSelector(state => state.teams.teams);

  // Local state
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [employee, setEmployee] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [pages, setPages] = useState({ leads: 1, contacts: 1, accounts: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setAttachment(null);
    setSubtaskInput('');
    setTagInput('');
    setPages({ leads: 1, contacts: 1, accounts: 1 });
  }, []);

  // Custom hook for handlers
  const {
    handleChange,
    handleModuleChange,
    handleAssignToChange,
    handleSubmit,
    handleFileChange,
    handleRemoveAttachment,
    listHandlers,
    paginationHandlers
  } = useTaskFormHandlers({
    formData,
    setFormData,
    setErrors,
    setAttachment,
    setSubtaskInput,
    setTagInput,
    setPages,
    setIsSubmitting,
    subtaskInput,
    tagInput,
    role,
    userId,
    leadsNext,
    leadsPrevious,
    isEditing,
    task,
    onClose,
    resetForm
  });

  // Initialize form data with task for editing
  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || '',
        lead: task.lead || null,
        contact: task.contact || null,
        account: task.account || null,
        status: task.status || 'TODO',
        subtasks: task.subtasks || [],
        attachment: task.attachment ? [task.attachment] : [],
        tags: task.tags || [],
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [task, isEditing]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser(role === 'owner' ? role : userId);
        setEmployee(user);
        dispatch(role === 'owner' ? fetchLeadsOwner() : fetchLeadsEmployee(userId));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchData();
    dispatch(fetchContacts());
    dispatch(fetchAccounts());
    dispatch(fetchTeams());
  }, [role, userId, dispatch]);

  // Memoized options
  const options = useMemo(() => ({
    employee: employee.map(member => ({ 
      id: member.id, 
      name: `${member.name} (${member.role.name})` 
    })),
    leads: leads.map(lead => ({ 
      id: lead.lead_id, 
      name: `${lead.name}(${lead.lead_id})` 
    })),
    teams: teams.map(team => ({ 
      id: team.id, 
      name: `${team.name} (${team.members.length + 1} members)` 
    }))
  }), [employee, leads, teams]);

  // Render related modules
  const renderRelatedModules = () => {
    const modules = [
      { 
        name: 'lead', 
        label: 'Lead', 
        options: options.leads, 
        handlers: paginationHandlers.leads, 
        pagination: { hasPrev: leadsPrevious, hasNext: leadsNext } 
      },
      { 
        name: 'contact', 
        label: 'Contact', 
        options: contacts, 
        handlers: paginationHandlers.contacts,
        pagination: { hasPrev: pages.contacts > 1, hasNext: true } 
      },
      { 
        name: 'account', 
        label: 'Account', 
        options: accounts, 
        handlers: paginationHandlers.accounts,
        pagination: { hasPrev: pages.accounts > 1, hasNext: true } 
      }
    ];

    return modules.map(({ name, label, options, handlers, pagination }) => (
      <div key={name}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <PaginationArrows 
            onPrev={handlers.prev} 
            onNext={handlers.next} 
            hasPrev={pagination.hasPrev} 
            hasNext={pagination.hasNext} 
          />
        </div>
        <select
          name={name}
          value={formData[name] || ''}
          onChange={handleModuleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={['lead', 'contact', 'account'].some(key => key !== name && formData[key])}
        >
          <option value="">Select a {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option.id || option.lead_id} value={option.id || option.lead_id}>
              {option.name}
            </option>
          ))}
        </select>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Page {pages[name]}</span>
          {options.length === 0 && <span>No data available</span>}
        </div>
      </div>
    ));
  };

  return (
    <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          className="text-gray-500 hover:text-gray-700 text-xl font-bold p-1" 
          onClick={onClose} 
          aria-label="Close"
          type="button"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <FormField label="Task Title" required error={errors.title}>
            <input
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
          </FormField>
          
          <FormField label="Description" error={errors.description} required>
            <textarea
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the task in detail (minimum 30 words)..."
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              Words: {formData.description ? formData.description.trim().split(/\s+/).length : 0} / 30 minimum
            </div>
          </FormField>
        </div>
        
        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Priority">
            <SelectField 
              options={OPTIONS.priority} 
              value={formData.priority} 
              onChange={handleChange} 
              name="priority"
              disabled={isSubmitting}
            />
          </FormField>
          
          <FormField label="Status">
            <SelectField 
              options={OPTIONS.status} 
              value={formData.status} 
              onChange={handleChange} 
              name="status"
              disabled={isSubmitting}
            />
          </FormField>
          
          <FormField label="Due Date" required error={errors.dueDate}>
            <input
              type="date" 
              name="dueDate" 
              value={formData.dueDate} 
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
          </FormField>
        </div>
        
        {/* Assignment Section - Only show for new tasks */}
        {!isEditing && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-4">Task Assignment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <div className="flex">
                  {['individual', 'team'].map((type, idx) => (
                    <button
                      key={type}
                      type="button"
                      className={`px-4 py-2 border ${
                        idx === 0 ? 'rounded-l-md' : 'rounded-r-md border-l-0'
                      } ${
                        formData.assignTo === type 
                          ? 'bg-blue-50 border-blue-500 text-blue-700' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAssignToChange(type)}
                      disabled={isSubmitting}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <FormField 
                label={`Select ${formData.assignTo === 'individual' ? 'Team Member' : 'Team'}`} 
                required 
                error={errors[`assigned_to_${formData.assignTo === 'individual' ? 'employee' : 'team'}`]}
              >
                <SelectField
                  options={formData.assignTo === 'individual' ? options.employee : options.teams}
                  value={formData[`assigned_to_${formData.assignTo === 'individual' ? 'employee' : 'team'}`] || ''}
                  onChange={handleChange}
                  name={`assigned_to_${formData.assignTo === 'individual' ? 'employee' : 'team'}`}
                  placeholder={`Select a ${formData.assignTo === 'individual' ? 'team member' : 'team'}`}
                  error={errors[`assigned_to_${formData.assignTo === 'individual' ? 'employee' : 'team'}`]}
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
          </div>
        )}
        
        {/* Related To Section */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Related To</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {renderRelatedModules()}
          </div>
          <p className="text-sm text-gray-500 italic">
            Note: A task can only be related to one item. Selecting a new item will clear the previous selection.
          </p>
        </div>

        {/* Attachments */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Attachments</h3>
          <div className="mb-3">
            <label
              htmlFor="file-upload"
              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add Files
            </label>
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {attachment && (
              <span className="ml-3 text-sm text-gray-500">
                {attachment.name}
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
                  title="Remove file"
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </span>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <ListManager
            items={formData.tags}
            input={tagInput}
            setInput={setTagInput}
            onAdd={listHandlers.tag.add}
            onRemove={listHandlers.tag.remove}
            placeholder="Add a tag"
            disabled={isSubmitting}
            renderItem={(tag, index, onRemove) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemove(tag)}
                  className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700"
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </span>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          {!isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Reset
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;