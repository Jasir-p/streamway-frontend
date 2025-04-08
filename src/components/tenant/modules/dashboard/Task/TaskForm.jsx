import React, { useState } from 'react';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignTo: 'individual',
    assignee: '',
    team: '',
    status: 'not_started',
    relatedTo: '',
    relatedItem: '',
    estimatedHours: '',
    subtasks: [],
    attachments: [],
    tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [subtaskInput, setSubtaskInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Mock data that would normally come from your API
  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Sales Manager' },
    { id: 2, name: 'Jane Smith', role: 'Marketing Specialist' },
    { id: 3, name: 'Mike Johnson', role: 'Account Executive' },
    { id: 4, name: 'Sarah Williams', role: 'Customer Support' }
  ];
  
  const teams = [
    { id: 1, name: 'Sales Team', memberCount: 8 },
    { id: 2, name: 'Marketing Team', memberCount: 5 },
    { id: 3, name: 'Support Team', memberCount: 12 },
    { id: 4, name: 'Development Team', memberCount: 10 }
  ];
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    if (formData.assignTo === 'individual' && !formData.assignee) {
      newErrors.assignee = 'Please select a team member';
    } else if (formData.assignTo === 'team' && !formData.team) {
      newErrors.team = 'Please select a team';
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log('Form submitted:', formData);
      
      // Clear the form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignTo: 'individual',
        assignee: '',
        team: '',
        status: 'not_started',
        relatedTo: '',
        relatedItem: '',
        estimatedHours: '',
        subtasks: [],
        attachments: [],
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
      attachments: [...prev.attachments, ...fileData]
    }));
  };
  
  const removeAttachment = (id) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file.id !== id)
    }));
  };

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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
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
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
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
          
          <div>
            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0.0"
            />
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
                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">Select Team Member*</label>
                <select
                  id="assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.assignee ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
                {errors.assignee && <p className="mt-1 text-sm text-red-500">{errors.assignee}</p>}
              </div>
            ) : (
              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Select Team*</label>
                <select
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.team ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.memberCount} members)
                    </option>
                  ))}
                </select>
                {errors.team && <p className="mt-1 text-sm text-red-500">{errors.team}</p>}
              </div>
            )}
          </div>
        </div>
        
        {/* Related To Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="relatedTo" className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
            <select
              id="relatedTo"
              name="relatedTo"
              value={formData.relatedTo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">None</option>
              <option value="contact">Contact</option>
              <option value="deal">Deal</option>
              <option value="project">Project</option>
            </select>
          </div>
          
          {formData.relatedTo && (
            <div>
              <label htmlFor="relatedItem" className="block text-sm font-medium text-gray-700 mb-1">
                Select {formData.relatedTo.charAt(0).toUpperCase() + formData.relatedTo.slice(1)}
              </label>
              <select
                id="relatedItem"
                name="relatedItem"
                value={formData.relatedItem}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                <option value="1">Sample {formData.relatedTo} 1</option>
                <option value="2">Sample {formData.relatedTo} 2</option>
                <option value="3">Sample {formData.relatedTo} 3</option>
              </select>
            </div>
          )}
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
              onChange={handleFileChange}
            />
            <span className="ml-3 text-sm text-gray-500">
              {formData.attachments.length} file(s) attached
            </span>
          </div>
          
          <ul className="space-y-2 max-h-32 overflow-y-auto">
            {formData.attachments.length === 0 ? (
              <li className="text-gray-500 text-sm">No files attached</li>
            ) : (
              formData.attachments.map(file => (
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