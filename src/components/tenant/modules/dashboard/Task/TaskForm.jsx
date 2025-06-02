import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { addTask } from '../../../../../redux/slice/TaskSlice';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';
import { fetchContacts } from '../../../../../redux/slice/contactSlice';
import { fetchAccounts } from '../../../../../redux/slice/AccountsSlice';

// Constants
const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  assignTo: 'individual',
  assigned_to_employee: '',
  assigned_to_team: null,
  lead: null,
  contact: null,
  account: null,
  status: 'TODO',
  subtasks: [],
  attachment: [],
  tags: []
};

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' }
];

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Under Review' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'BLOCKED', label: 'Blocked' }
];

const TEAMS = [
  { id: 1, name: 'Sales Team', memberCount: 8 },
  { id: 2, name: 'Marketing Team', memberCount: 5 },
  { id: 3, name: 'Support Team', memberCount: 12 },
  { id: 4, name: 'Development Team', memberCount: 10 }
];

// Custom Hooks
const useFormState = (initialData, task) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        dueDate: task.duedate || '',
        assignTo: task.assignees?.length > 1 ? 'team' : 'individual',
        assigned_to_employee: task.assignees?.[0] || '',
        assigned_to_team: task.assignees?.length > 1 ? task.assignees : null,
        lead: task.lead || null,
        contact: task.contact || null,
        account: task.account || null,
        status: task.status || 'TODO',
        subtasks: task.subtasks || [],
        attachment: task.attachment ? [task.attachment] : [],
        tags: task.tags || []
      });
    }
  }, [task]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  return { formData, setFormData, errors, setErrors, updateFormData, resetForm };
};

const usePagination = () => {
  const [pages, setPages] = useState({
    leads: 1,
    contacts: 1,
    accounts: 1
  });

  const updatePage = useCallback((type, page) => {
    setPages(prev => ({ ...prev, [type]: page }));
  }, []);

  return { pages, updatePage };
};

// Components
const PaginationArrows = ({ onPrev, onNext, hasPrev, hasNext }) => (
  <div className="flex items-center">
    <button
      type="button"
      onClick={onPrev}
      disabled={!hasPrev}
      className={`p-1 rounded ${!hasPrev ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
      aria-label="Previous page"
    >
      <ChevronLeft size={16} />
    </button>
    <button
      type="button"
      onClick={onNext}
      disabled={!hasNext}
      className={`p-1 rounded ${!hasNext ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
      aria-label="Next page"
    >
      <ChevronRight size={16} />
    </button>
  </div>
);

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && '*'}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ options, value, onChange, placeholder, error, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
    {...props}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.value || option.id} value={option.value || option.id}>
        {option.label || option.name}
      </option>
    ))}
  </select>
);

const TaskForm = ({ onClose, task, isEditing }) => {
  // Redux state
  const { role } = useSelector(state => state.auth);
  const { id: userId } = useSelector(state => state.profile);
  const { leads, next: leadsNext, previous: leadsPrevious } = useSelector(state => state.leads);
  const { contacts } = useSelector(state => state.contacts);
  const { accounts } = useSelector(state => state.accounts);

  // Local state
  const [employee, setEmployee] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Custom hooks
  const { formData, errors, setErrors, updateFormData, resetForm } = useFormState(INITIAL_FORM_DATA, task);
  const { pages, updatePage } = usePagination();

  const dispatch = useDispatch();

  // Memoized values
  const employeeOptions = useMemo(() => 
    employee.map(member => ({
      id: member.id,
      name: `${member.name} (${member.role.name})`
    })), [employee]
  );

  const leadsOptions = useMemo(() => 
    leads.map(lead => ({
      id: lead.lead_id,
      name: `${lead.name}(${lead.lead_id})`
    })), [leads]
  );

  // Effects
  useEffect(() => {
    const fetchUserAndLeads = async () => {
      try {
        const user = await getUser(role === 'owner' ? role : userId);
        setEmployee(user);

        if (role === 'owner') {
          dispatch(fetchLeadsOwner());
        } else {
          dispatch(fetchLeadsEmployee(userId));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserAndLeads();
  }, [role, userId, dispatch]);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch, pages.contacts]);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch, pages.accounts]);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  }, [updateFormData]);

  const handleModuleChange = useCallback((e) => {
    const { name, value } = e.target;
    updateFormData({
      lead: null,
      contact: null,
      account: null,
      [name]: value
    });
  }, [updateFormData]);

  const handleSubtaskAdd = useCallback(() => {
    if (subtaskInput.trim()) {
      updateFormData({
        subtasks: [...formData.subtasks, {
          id: Date.now(),
          text: subtaskInput.trim(),
          completed: false
        }]
      });
      setSubtaskInput('');
    }
  }, [subtaskInput, formData.subtasks, updateFormData]);

  const handleSubtaskToggle = useCallback((id) => {
    updateFormData({
      subtasks: formData.subtasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    });
  }, [formData.subtasks, updateFormData]);

  const handleSubtaskRemove = useCallback((id) => {
    updateFormData({
      subtasks: formData.subtasks.filter(task => task.id !== id)
    });
  }, [formData.subtasks, updateFormData]);

  const handleTagAdd = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData({
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  }, [tagInput, formData.tags, updateFormData]);

  const handleTagRemove = useCallback((tag) => {
    updateFormData({
      tags: formData.tags.filter(t => t !== tag)
    });
  }, [formData.tags, updateFormData]);

  // Pagination handlers
  const handlePagination = useCallback({
    nextLeads: () => {
      if (role === 'owner') {
        dispatch(fetchLeadsOwner(leadsNext));
      } else {
        dispatch(fetchLeadsEmployee(userId, leadsNext));
      }
    },
    prevLeads: () => {
      if (leadsPrevious) {
        if (role === 'owner') {
          dispatch(fetchLeadsOwner(leadsPrevious));
        } else {
          dispatch(fetchLeadsEmployee(userId, leadsPrevious));
        }
      }
    },
    nextContacts: () => updatePage('contacts', pages.contacts + 1),
    prevContacts: () => pages.contacts > 1 && updatePage('contacts', pages.contacts - 1),
    nextAccounts: () => updatePage('accounts', pages.accounts + 1),
    prevAccounts: () => pages.accounts > 1 && updatePage('accounts', pages.accounts - 1)
  }, [role, userId, dispatch, leadsNext, leadsPrevious, pages, updatePage]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.description || formData.description.trim().split(/\s+/).length < 30) {
      newErrors.description = 'Task description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (formData.assignTo === 'individual' && !formData.assigned_to_employee) {
      newErrors.assigned_to_employee = 'Please select a team member';
    } else if (formData.assignTo === 'team' && !formData.assigned_to_team) {
      newErrors.assigned_to_team = 'Please select a team';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formDataObj = new FormData();
    
    // Add file if exists
    if (attachment) {
      formDataObj.append('attachment', attachment);
    }
    
    // Add related entities
    ['lead', 'contact', 'account'].forEach(field => {
      if (formData[field] !== null && formData[field] !== "") {
        formDataObj.append(field, formData[field]);
      }
    });
    
    // Add other fields
    const fields = ['title', 'priority', 'status', 'description', 'assignTo', 'assigned_to_employee',"dueDate"];
    fields.forEach(field => {
      formDataObj.append(field === 'dueDate' ? 'duedate' : field, formData[field === 'dueDate' ? 'dueDate' : field]);
    });

    if (role !== 'owner') {

  formDataObj.append('assigned_by', userId);

  
  if (!isEditing) {
    console.log('jasirppppp');
    
    formDataObj.append('created_by', userId);
  }
}


console.log(formDataObj);

   

    try {
      dispatch(addTask(formDataObj));
      resetForm();
      setAttachment(null);
      alert('Task created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  }, [formData, attachment, validateForm, dispatch, resetForm, onClose]);

  return (
    <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          className="text-gray-500 hover:text-gray-700" 
          onClick={onClose}
          aria-label="Close"
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
              className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter task title"
            />
          </FormField>
          
          <FormField label="Description" error={errors.description}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Describe the task..."
            />
          </FormField>
        </div>
        
        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Priority">
            <SelectField
              options={PRIORITY_OPTIONS}
              value={formData.priority}
              onChange={handleChange}
              name="priority"
            />
          </FormField>
          
          <FormField label="Status">
            <SelectField
              options={STATUS_OPTIONS}
              value={formData.status}
              onChange={handleChange}
              name="status"
            />
          </FormField>
          
          <FormField label="Due Date" required error={errors.dueDate}>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
            />
          </FormField>
        </div>
        
        {/* Assignment Section */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Task Assignment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <div className="flex">
                {['individual', 'team'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 border ${type === 'individual' ? 'rounded-l-md' : 'rounded-r-md border-l-0'} ${
                      formData.assignTo === type 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                    onClick={() => updateFormData({ assignTo: type })}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {formData.assignTo === 'individual' ? (
              <FormField label="Select Team Member" required error={errors.assigned_to_employee}>
                <SelectField
                  options={employeeOptions}
                  value={formData.assigned_to_employee}
                  onChange={handleChange}
                  name="assigned_to_employee"
                  placeholder="Select a team member"
                  error={errors.assigned_to_employee}
                />
              </FormField>
            ) : (
              <FormField label="Select Team" required error={errors.assigned_to_team}>
                <SelectField
                  options={TEAMS.map(team => ({
                    id: team.id,
                    name: `${team.name} (${team.memberCount} members)`
                  }))}
                  value={formData.assigned_to_team || ''}
                  onChange={handleChange}
                  name="assigned_to_team"
                  placeholder="Select a team"
                  error={errors.assigned_to_team}
                />
              </FormField>
            )}
          </div>
        </div>
        
        {/* Related To Section */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Related To</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { name: 'lead', label: 'Lead', options: leadsOptions, pagination: { prev: handlePagination.prevLeads, next: handlePagination.nextLeads, hasPrev: leadsPrevious, hasNext: leadsNext }, page: pages.leads },
              { name: 'contact', label: 'Contact', options: contacts, pagination: { prev: handlePagination.prevContacts, next: handlePagination.nextContacts, hasPrev: pages.contacts > 1, hasNext: true }, page: pages.contacts },
              { name: 'account', label: 'Account', options: accounts, pagination: { prev: handlePagination.prevAccounts, next: handlePagination.nextAccounts, hasPrev: pages.accounts > 1, hasNext: true }, page: pages.accounts }
            ].map(({ name, label, options, pagination, page }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <PaginationArrows {...pagination} />
                </div>
                <select
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleModuleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={Object.keys(formData).some(key => 
                    key !== name && ['lead', 'contact', 'account'].includes(key) && formData[key]
                  )}
                >
                  <option value="">Select a {label.toLowerCase()}</option>
                  {options.map(option => (
                    <option key={option.id || option.lead_id} value={option.id || option.lead_id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Page {page}</span>
                  {options.length === 0 && <span>No data</span>}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 italic">
            Note: A task can only be related to one item. Selecting a new item will clear the previous selection.
          </p>
        </div>
        
        {/* Subtasks */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Subtasks</h3>
          
          <div className="flex mb-3">
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-md"
              placeholder="Add a subtask"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSubtaskAdd())}
            />
            <button
              type="button"
              onClick={handleSubtaskAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {formData.subtasks.length === 0 ? (
              <li className="text-gray-500 text-sm">No subtasks added yet</li>
            ) : (
              formData.subtasks.map(task => (
                <li key={task.id} className="flex items-center bg-white p-2 rounded border border-gray-200">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleSubtaskToggle(task.id)}
                    className="mr-2"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSubtaskRemove(task.id)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        
        {/* Attachments */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Attachments</h3>
          
          <div className="mb-3">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
              onChange={(e) => setAttachment(e.target.files[0])}
            />
            {attachment && (
              <span className="ml-3 text-sm text-gray-500">
                {attachment.name}
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold"
                  title="Remove file"
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
          <div className="flex mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-md"
              placeholder="Add a tag"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.tags.length === 0 ? (
              <span className="text-gray-500 text-sm">No tags added</span>
            ) : (
              formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;