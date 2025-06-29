// hooks/useTaskFormHandlers.js
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { addTask,editTask } from '../../../../../../redux/slice/TaskSlice';

import { fetchLeadsEmployee,fetchLeadsOwner } from '../../../../../../redux/slice/leadsSlice';

export const useTaskFormHandlers = ({
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
}) => {
  const dispatch = useDispatch();

  // Generic form data updater
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, [setFormData]);

  // Basic input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  }, [updateFormData]);

  // Module change handler (lead/contact/account)
  const handleModuleChange = useCallback((e) => {
    const { name, value } = e.target;
    updateFormData({ 
      lead: null, 
      contact: null, 
      account: null, 
      [name]: value 
    });
  }, [updateFormData]);

  // Assignment type change handler
  const handleAssignToChange = useCallback((type) => {
    if (!isEditing) {
      updateFormData({ 
        assignTo: type,
        assigned_to_employee: type === 'individual' ? formData.assigned_to_employee : '',
        assigned_to_team: type === 'team' ? formData.assigned_to_team : null
      });
    }
  }, [updateFormData, formData.assigned_to_employee, formData.assigned_to_team, isEditing]);

  // List management handlers
  const listHandlers = useMemo(() => ({
    subtask: {
      add: () => {
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
  }), [formData.subtasks, formData.tags, subtaskInput, tagInput, updateFormData, setSubtaskInput, setTagInput]);

  // Pagination handlers
  const paginationHandlers = useMemo(() => {
    const fetchLeads = (url) => dispatch(role === 'owner' ? fetchLeadsOwner(url) : fetchLeadsEmployee(userId, url));
    const updatePage = (type, delta) => setPages(prev => ({ ...prev, [type]: Math.max(1, prev[type] + delta) }));
    
    return {
      leads: { 
        next: () => fetchLeads(leadsNext), 
        prev: () => leadsPrevious && fetchLeads(leadsPrevious) 
      },
      contacts: { 
        next: () => updatePage('contacts', 1), 
        prev: () => updatePage('contacts', -1) 
      },
      accounts: { 
        next: () => updatePage('accounts', 1), 
        prev: () => updatePage('accounts', -1) 
      }
    };
  }, [role, userId, dispatch, leadsNext, leadsPrevious, setPages]);

  // Validation handler
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Common validations for both create and edit
    const commonValidations = [
      [!formData.title.trim(), 'title', 'Task title is required'],
      [!formData.description || formData.description.trim().split(/\s+/).length < 30, 'description', 'Task description must be at least 30 words'],
      [!formData.dueDate, 'dueDate', 'Due date is required']
    ];

    // Assignment validations only for new tasks
    const assignmentValidations = !isEditing ? [
      [formData.assignTo === 'individual' && !formData.assigned_to_employee, 'assigned_to_employee', 'Please select a team member'],
      [formData.assignTo === 'team' && !formData.assigned_to_team, 'assigned_to_team', 'Please select a team']
    ] : [];
    
    [...commonValidations, ...assignmentValidations].forEach(([condition, field, message]) => {
      if (condition) newErrors[field] = message;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditing, setErrors]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      
      // Add related modules (lead, contact, account)
      ['lead', 'contact', 'account'].forEach(field => {
        if (formData[field] !== null && formData[field] !== "") {
          formDataObj.append(field, formData[field]);
        }
      });
      
      // Add basic task fields
      const basicFields = ['title', 'priority', 'status', 'description'];
      basicFields.forEach(field => {
        formDataObj.append(field, formData[field]);
      });
      
      // Add due date
      formDataObj.append('duedate', formData.dueDate);
      
      // Add assignment fields only for new tasks
      if (!isEditing) {
        formDataObj.append('assignTo', formData.assignTo);
        
        if (formData.assignTo === 'individual' && formData.assigned_to_employee) {
          formDataObj.append('assigned_to_employee', formData.assigned_to_employee);
        }
        
        if (formData.assignTo === 'team' && formData.assigned_to_team) {
          formDataObj.append('assigned_to_team', formData.assigned_to_team);
        }
        
        // Add creator/assigner info for new tasks
        if (role !== 'owner') {
          formDataObj.append('assigned_by', userId);
          formDataObj.append('created_by', userId);
        }
      }
      
      // Add subtasks and tags as JSON strings
      if (formData.subtasks.length > 0) {
        formDataObj.append('subtasks', JSON.stringify(formData.subtasks));
      }
      
      if (formData.tags.length > 0) {
        formDataObj.append('tags', JSON.stringify(formData.tags));
      }

      // Dispatch appropriate action
      if (isEditing) {
        formDataObj.append('id', task.id);

        if (formData.lead && formData.lead.lead_id) {
            formDataObj.set("lead", formData.lead.lead_id);
        }

        if (formData.contact && formData.contact.id) {
            formDataObj.set("contact", formData.contact.id);
        }

        if (formData.account && formData.account.id) {
            formDataObj.set("account", formData.account.id);
        }

        await dispatch(editTask({ task_id: task.id, taskData: formDataObj })).unwrap();

        } else {
        await dispatch(addTask(formDataObj)).unwrap();
        }

      
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error submitting task:', error);
      alert(`Error ${isEditing ? 'updating' : 'creating'} task. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData, 
    validateForm, 
    dispatch, 
    onClose, 
    role, 
    userId, 
    isEditing, 
    task, 
    resetForm,
    setIsSubmitting
  ]);

  // File attachment handler
  const handleFileChange = useCallback((e) => {
    setAttachment(e.target.files[0]);
  }, [setAttachment]);

  // Remove attachment handler
  const handleRemoveAttachment = useCallback(() => {
    setAttachment(null);
  }, [setAttachment]);

  return {
    handleChange,
    handleModuleChange,
    handleAssignToChange,
    handleSubmit,
    handleFileChange,
    handleRemoveAttachment,
    listHandlers,
    paginationHandlers,
    validateForm,
    updateFormData
  };
};