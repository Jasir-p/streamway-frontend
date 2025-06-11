import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { addTask } from '../../../../../redux/slice/TaskSlice';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';
import { fetchContacts } from '../../../../../redux/slice/contactSlice';
import { fetchAccounts } from '../../../../../redux/slice/AccountsSlice';
import { fetchTeams } from '../../../../../redux/slice/TeamSlice';

// Constants
const INITIAL_FORM_DATA = {
  title: '', description: '', priority: 'MEDIUM', dueDate: '', assignTo: 'individual',
  assigned_to_employee: '', assigned_to_team: null, lead: null, contact: null,
  account: null, status: 'TODO', subtasks: [], attachment: [], tags: []
};

const OPTIONS = {
  priority: [
    { value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' }, { value: 'URGENT', label: 'Urgent' }
  ],
  status: [
    { value: 'TODO', label: 'To Do' }, { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Under Review' }, { value: 'COMPLETED', label: 'Completed' },
    { value: 'BLOCKED', label: 'Blocked' }
  ],
};

// Reusable Components
const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && '*'}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ options, value, onChange, placeholder, error, name, ...props }) => (
  <select
    name={name}
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

const PaginationArrows = ({ onPrev, onNext, hasPrev, hasNext }) => (
  <div className="flex items-center">
    {[
      { onClick: onPrev, disabled: !hasPrev, icon: ChevronLeft, label: "Previous" },
      { onClick: onNext, disabled: !hasNext, icon: ChevronRight, label: "Next" }
    ].map(({ onClick, disabled, icon: Icon, label }, idx) => (
      <button
        key={idx}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-1 rounded ${disabled ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label={`${label} page`}
      >
        <Icon size={16} />
      </button>
    ))}
  </div>
);

const ListManager = ({ items, input, setInput, onAdd, onRemove, onToggle, placeholder, renderItem }) => (
  <>
    <div className="flex mb-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-l-md"
        placeholder={placeholder}
        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
      />
      <button
        type="button"
        onClick={onAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
      >
        Add
      </button>
    </div>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {items.length === 0 ? (
        <div className="text-gray-500 text-sm">No items added yet</div>
      ) : (
        items.map((item, index) => renderItem(item, index, onRemove, onToggle))
      )}
    </div>
  </>
);

const TaskForm = ({ onClose, task, isEditing }) => {
  // Redux state
  const { role } = useSelector(state => state.auth);
  const { id: userId } = useSelector(state => state.profile);
  const { leads, next: leadsNext, previous: leadsPrevious } = useSelector(state => state.leads);
  const { contacts } = useSelector(state => state.contacts);
  const { accounts } = useSelector(state => state.accounts);
  const teams = useSelector(state => state.teams.teams)

  // Local state
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [employee, setEmployee] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [pages, setPages] = useState({ leads: 1, contacts: 1, accounts: 1 });

  const dispatch = useDispatch();

  // Initialize form data with task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '', description: task.description || '',
        priority: task.priority || 'MEDIUM', dueDate: task.duedate || '',
        assignTo: task.assignees?.length > 1 ? 'team' : 'individual',
        assigned_to_employee: task.assignees?.[0] || '',
        assigned_to_team: task.assignees?.length > 1 ? task.assignees : null,
        lead: task.lead || null, contact: task.contact || null,
        account: task.account || null, status: task.status || 'TODO',
        subtasks: task.subtasks || [], attachment: task.attachment ? [task.attachment] : [],
        tags: task.tags || []
      });
    }
  }, [task]);

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
    dispatch(fetchTeams())
  }, [role, userId, dispatch]);

  // Memoized options
  const options = useMemo(() => ({
    employee: employee.map(member => ({ id: member.id, name: `${member.name} (${member.role.name})` })),
    leads: leads.map(lead => ({ id: lead.lead_id, name: `${lead.name}(${lead.lead_id})` })),
    teams: teams.map(team => ({ id: team.id, name: `${team.name} (${team.members.length + 1} members)` }))
  }), [employee, leads, teams]);

  // Generic handlers
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  }, [updateFormData]);

  const handleModuleChange = useCallback((e) => {
    const { name, value } = e.target;
    updateFormData({ lead: null, contact: null, account: null, [name]: value });
  }, [updateFormData]);

  // Assignment type change handler
  const handleAssignToChange = useCallback((type) => {
    updateFormData({ 
      assignTo: type,
      assigned_to_employee: type === 'individual' ? formData.assigned_to_employee : '',
      assigned_to_team: type === 'team' ? formData.assigned_to_team : null
    });
  }, [updateFormData, formData.assigned_to_employee, formData.assigned_to_team]);

  // List management handlers
  const listHandlers = useMemo(() => ({
    subtask: {
      add: () => {
        if (subtaskInput.trim()) {
          updateFormData({
            subtasks: [...formData.subtasks, { id: Date.now(), text: subtaskInput.trim(), completed: false }]
          });
          setSubtaskInput('');
        }
      },
      toggle: (id) => updateFormData({
        subtasks: formData.subtasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      }),
      remove: (id) => updateFormData({
        subtasks: formData.subtasks.filter(task => task.id !== id)
      })
    },
    tag: {
      add: () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
          updateFormData({ tags: [...formData.tags, tagInput.trim()] });
          setTagInput('');
        }
      },
      remove: (tag) => updateFormData({
        tags: formData.tags.filter(t => t !== tag)
      })
    }
  }), [formData.subtasks, formData.tags, subtaskInput, tagInput, updateFormData]);

  // Pagination handlers
  const paginationHandlers = useMemo(() => {
    const fetchLeads = (url) => dispatch(role === 'owner' ? fetchLeadsOwner(url) : fetchLeadsEmployee(userId, url));
    const updatePage = (type, delta) => setPages(prev => ({ ...prev, [type]: Math.max(1, prev[type] + delta) }));
    
    return {
      leads: { next: () => fetchLeads(leadsNext), prev: () => leadsPrevious && fetchLeads(leadsPrevious) },
      contacts: { next: () => updatePage('contacts', 1), prev: () => updatePage('contacts', -1) },
      accounts: { next: () => updatePage('accounts', 1), prev: () => updatePage('accounts', -1) }
    };
  }, [role, userId, dispatch, leadsNext, leadsPrevious]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    const validations = [
      [!formData.title.trim(), 'title', 'Task title is required'],
      [!formData.description || formData.description.trim().split(/\s+/).length < 30, 'description', 'Task description is required'],
      [!formData.dueDate, 'dueDate', 'Due date is required'],
      [formData.assignTo === 'individual' && !formData.assigned_to_employee, 'assigned_to_employee', 'Please select a team member'],
      [formData.assignTo === 'team' && !formData.assigned_to_team, 'assigned_to_team', 'Please select a team']
    ];
    
    validations.forEach(([condition, field, message]) => {
      if (condition) newErrors[field] = message;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataObj = new FormData();
    
    if (attachment) formDataObj.append('attachment', attachment);
    
    ['lead', 'contact', 'account'].forEach(field => {
      if (formData[field] !== null && formData[field] !== "") {
        formDataObj.append(field, formData[field]);
      }
    });
    
    ['title', 'priority', 'status', 'description', 'assignTo', 'assigned_to_employee', 'assigned_to_team', 'dueDate']
      .forEach(field => {
        if (field === 'assigned_to_team' && formData.assignTo !== 'team') return;
        if (field === 'assigned_to_employee' && formData.assignTo !== 'individual') return;
        formDataObj.append(field === 'dueDate' ? 'duedate' : field, formData[field]);
      });

    if (role !== 'owner') {
      formDataObj.append('assigned_by', userId);
      if (!isEditing) formDataObj.append('created_by', userId);
    }

    try {
      dispatch(addTask(formDataObj));
      setFormData(INITIAL_FORM_DATA);
      setAttachment(null);
      alert('Task created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  }, [formData, attachment, validateForm, dispatch, onClose, role, userId, isEditing]);

  // Render related modules
  const renderRelatedModules = () => {
    const modules = [
      { name: 'lead', label: 'Lead', options: options.leads, handlers: paginationHandlers.leads, 
        pagination: { hasPrev: leadsPrevious, hasNext: leadsNext } },
      { name: 'contact', label: 'Contact', options: contacts, handlers: paginationHandlers.contacts,
        pagination: { hasPrev: pages.contacts > 1, hasNext: true } },
      { name: 'account', label: 'Account', options: accounts, handlers: paginationHandlers.accounts,
        pagination: { hasPrev: pages.accounts > 1, hasNext: true } }
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
          className="w-full p-2 border border-gray-300 rounded-md"
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
          {options.length === 0 && <span>No data</span>}
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
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close">✕</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <FormField label="Task Title" required error={errors.title}>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter task title"
            />
          </FormField>
          
          <FormField label="Description" error={errors.description}>
            <textarea
              name="description" value={formData.description} onChange={handleChange} rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Describe the task..."
            />
          </FormField>
        </div>
        
        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Priority">
            <SelectField options={OPTIONS.priority} value={formData.priority} onChange={handleChange} name="priority" />
          </FormField>
          
          <FormField label="Status">
            <SelectField options={OPTIONS.status} value={formData.status} onChange={handleChange} name="status" />
          </FormField>
          
          <FormField label="Due Date" required error={errors.dueDate}>
            <input
              type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
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
                {['individual', 'team'].map((type, idx) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 border ${idx === 0 ? 'rounded-l-md' : 'rounded-r-md border-l-0'} ${
                      formData.assignTo === type 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                    onClick={() => handleAssignToChange(type)}
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
              />
            </FormField>
          </div>
        </div>
        
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
        
        {/* Subtasks */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Subtasks</h3>
          <ListManager
            items={formData.subtasks}
            input={subtaskInput}
            setInput={setSubtaskInput}
            onAdd={listHandlers.subtask.add}
            onRemove={listHandlers.subtask.remove}
            onToggle={listHandlers.subtask.toggle}
            placeholder="Add a subtask"
            renderItem={(task, index, onRemove, onToggle) => (
              <div key={task.id} className="flex items-center bg-white p-2 rounded border border-gray-200">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="mr-2"
                />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.text}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(task.id)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            )}
          />
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
          <ListManager
            items={formData.tags}
            input={tagInput}
            setInput={setTagInput}
            onAdd={listHandlers.tag.add}
            onRemove={listHandlers.tag.remove}
            placeholder="Add a tag"
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