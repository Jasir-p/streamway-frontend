import React, { useEffect, useState } from 'react';
import { AddTask } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { addTask } from '../../../../../redux/slice/TaskSlice';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';

const TaskForm = () => {
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.profile.id);
  const [employee, setEmployee] = useState([]);
  const { leads, next, previous } = useSelector((state) => state.leads);
  const dispatch = useDispatch();
  const teams = [
    { id: 1, name: 'Sales Team', memberCount: 8 },
    { id: 2, name: 'Marketing Team', memberCount: 5 },
    { id: 3, name: 'Support Team', memberCount: 12 },
    { id: 4, name: 'Development Team', memberCount: 10 }
  ];

  const contacts = [
    { id: 'CO123456', name: 'David Wilson (CO123456)' },
    { id: 'CO123457', name: 'Emma Davis (CO123457)' },
    { id: 'CO123458', name: 'Robert Miller (CO123458)' }
  ];
  
  const accounts = [
    { id: 'AC987654', name: 'Acme Corporation (AC987654)' },
    { id: 'AC987655', name: 'Global Industries (AC987655)' },
    { id: 'AC987656', name: 'Tech Solutions (AC987656)' }
  ];
  
  // Add states for pagination pages
  const [leadsPage, setLeadsPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const [accountsPage, setAccountsPage] = useState(1);
  
  // States to store paginated data
  const [paginatedContacts, setPaginatedContacts] = useState(contacts);
  const [paginatedAccounts, setPaginatedAccounts] = useState(accounts);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const fetchUserAndLeads = async () => {
      const user = await getUser(role === 'owner' ? role : userId);
      setEmployee(user);
  
      if (role === 'owner') {
        dispatch(fetchLeadsOwner());
      } else {
        dispatch(fetchLeadsEmployee(userId));
      }
    };
  
    fetchUserAndLeads();
  }, [role, userId, dispatch, leadsPage]);
  

  useEffect(() => {
    fetchPaginatedContacts(contactsPage);
  }, [contactsPage]);
  
  useEffect(() => {

    fetchPaginatedAccounts(accountsPage);
  }, [accountsPage]);

  const fetchPaginatedContacts = (page) => {
    console.log(`Fetching contacts page ${page}`);
    setPaginatedContacts(contacts);
  };
  
  const fetchPaginatedAccounts = (page) => {

    console.log(`Fetching accounts page ${page}`);
    setPaginatedAccounts(accounts);
  };
  
  // Pagination handler functions
  const handleNextLeads = () => {
    if (role === 'owner') {
      dispatch(fetchLeadsOwner(next));
    } else {
      dispatch(fetchLeadsEmployee(userId,next));
    }
  
  };
  
  const handlePrevLeads = () => {
    if (previous) {
      if (role === 'owner') {
        dispatch(fetchLeadsOwner(previous));
      } else {
        dispatch(fetchLeadsEmployee(userId,previous));
      }
    }
  };
  
  const handleNextContacts = () => {
    setContactsPage(prev => prev + 1);
  };
  
  const handlePrevContacts = () => {
    if (contactsPage > 1) {
      setContactsPage(prev => prev - 1);
    }
  };
  
  const handleNextAccounts = () => {
    setAccountsPage(prev => prev + 1);
  };
  
  const handlePrevAccounts = () => {
    if (accountsPage > 1) {
      setAccountsPage(prev => prev - 1);
    }
  };
  
  // Updated formData state to match the JSON structure provided
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM', // Updated to match the JSON case format
    dueDate: '',
    assignTo: 'individual',
    assigned_to_employee: '',
    assigned_to_team: null,
    lead: null,
    contact: null,
    account: null,
    status: 'TODO', 
    subtasks: [],// Updated to match the JSON format
    attachment: [],
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [subtaskInput, setSubtaskInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Mock data that would normally come from your API

  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    if (formData.assignTo === 'individual' && !formData.assigned_to_employee) {
      newErrors.assigned_to_employee = 'Please select a team member';
    } else if (formData.assignTo === 'team' && !formData.assigned_to_team) {
      newErrors.assigned_to_team = 'Please select a team';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubtaskAdd = () => {
    if (subtaskInput.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now(),
          text: subtaskInput.trim(),
          completed: false
        }]
      }));
      setSubtaskInput('');
    }
  };
  
  const handleSubtaskToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };
  
  const handleSubtaskRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(task => task.id !== id)
    }));
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset all module values
    const updatedFormData = {
      ...formData,
      lead: null,
      contact: null,
      account: null
    };
    
    // Set only the selected module value
    updatedFormData[name] = value;
    setFormData(updatedFormData);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataobj = new FormData();
      formDataobj.append('attachment', attachment); // ⬅️ actual File object
      formDataobj.append('lead', formData.lead);
      formDataobj.append('title', formData.title);
      formDataobj.append('priority', formData.priority);
      formDataobj.append('status', formData.status);
      formDataobj.append('description', formData.description);
      formDataobj.append('dueDate', formData.dueDate);
      formDataobj.append('assignTo', formData.assignTo);
      formDataobj.append('assigned_to_employee', formData.assigned_to_employee);

    
    if (validateForm()) {
      console.log('Form submitted:', formDataobj);
      const response = dispatch(addTask(formDataobj));
      
      // Reset form to initial state
      setFormData({
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
      });
      
      // Success message or redirect would go here
      alert('Task created successfully!');
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFormData(prev => ({
      ...prev,
      attachment: [...prev.attachment, ...fileData]
    }));
  };
  
  const removeAttachment = (id) => {
    setFormData(prev => ({
      ...prev,
      attachment: prev.attachment.filter(file => file.id !== id)
    }));
  };


  const PaginationArrows = ({ onPrev, onNext, hasPrev, hasNext }) => (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        className={`p-1 rounded ${!hasPrev ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className={`p-1 rounded ${!hasNext ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title and Description */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Describe the task..."
            ></textarea>
          </div>
        </div>
        
        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="COMPLETED">Completed</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date*</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
          </div>
        </div>
        
        {/* Assignment Section */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Task Assignment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <div className="flex">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-l-md border ${formData.assignTo === 'individual' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                  onClick={() => setFormData(prev => ({ ...prev, assignTo: 'individual' }))}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-r-md border-t border-r border-b ${formData.assignTo === 'team' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                  onClick={() => setFormData(prev => ({ ...prev, assignTo: 'team' }))}
                >
                  Team
                </button>
              </div>
            </div>
            
            {formData.assignTo === 'individual' ? (
              <div>
                <label htmlFor="assigned_to_employee" className="block text-sm font-medium text-gray-700 mb-1">Select Team Member*</label>
                <select
                  id="assigned_to_employee"
                  name="assigned_to_employee"
                  value={formData.assigned_to_employee}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.assigned_to_employee ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a team member</option>
                  {employee.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role.name})
                    </option>
                  ))}
                </select>
                {errors.assigned_to_employee && <p className="mt-1 text-sm text-red-500">{errors.assigned_to_employee}</p>}
              </div>
            ) : (
              <div>
                <label htmlFor="assigned_to_team" className="block text-sm font-medium text-gray-700 mb-1">Select Team*</label>
                <select
                  id="assigned_to_team"
                  name="assigned_to_team"
                  value={formData.assigned_to_team || ''}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.assigned_to_team ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.memberCount} members)
                    </option>
                  ))}
                </select>
                {errors.assigned_to_team && <p className="mt-1 text-sm text-red-500">{errors.assigned_to_team}</p>}
              </div>
            )}
          </div>
        </div>
        
        {/* Related To Section - Updated with Lead, Contact, Account options and pagination arrows */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-4">Related To</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="lead" className="block text-sm font-medium text-gray-700">Lead</label>
                <PaginationArrows 
                  onPrev={handlePrevLeads} 
                  onNext={handleNextLeads} 
                  hasPrev={previous} 
                  hasNext={next}
                />
              </div>
              <select
                id="lead"
                name="lead"
                value={formData.lead || ''}
                onChange={handleModuleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={formData.contact || formData.account}
              >
                <option value="">Select a lead</option>
                {leads.map(lead => (
                  <option key={lead.lead_id} value={lead.lead_id}>
                    {lead.name}({lead.lead_id})
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Page {leadsPage}</span>
                {leads.length === 0 && <span>No data</span>}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                <PaginationArrows 
                  onPrev={handlePrevContacts} 
                  onNext={handleNextContacts} 
                  hasPrev={contactsPage > 1} 
                  hasNext={true} // Mock pagination control - in real app this would be dynamically determined
                />
              </div>
              <select
                id="contact"
                name="contact"
                value={formData.contact || ''}
                onChange={handleModuleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={formData.lead || formData.account}
              >
                <option value="">Select a contact</option>
                {paginatedContacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Page {contactsPage}</span>
                {paginatedContacts.length === 0 && <span>No data</span>}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="account" className="block text-sm font-medium text-gray-700">Account</label>
                <PaginationArrows 
                  onPrev={handlePrevAccounts} 
                  onNext={handleNextAccounts} 
                  hasPrev={accountsPage > 1} 
                  hasNext={true} // Mock pagination control - in real app this would be dynamically determined
                />
              </div>
              <select
                id="account"
                name="account"
                value={formData.account || ''}
                onChange={handleModuleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={formData.lead || formData.contact}
              >
                <option value="">Select an account</option>
                {paginatedAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Page {accountsPage}</span>
                {paginatedAccounts.length === 0 && <span>No data</span>}
              </div>
            </div>
          </div>
          
          {/* Help text */}
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
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              onChange={(e) => setAttachment(e.target.files[0])}
            />
            <span className="ml-3 text-sm text-gray-500">
              {formData.attachment.length} file(s) attached
            </span>
          </div>
          
          <ul className="space-y-2 max-h-32 overflow-y-auto">
            {formData.attachment.length === 0 ? (
              <li className="text-gray-500 text-sm">No files attached</li>
            ) : (
              formData.attachment.map(file => (
                <li key={file.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="truncate max-w-xs">{file.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
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
        
        {/* Submit Buttons */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;