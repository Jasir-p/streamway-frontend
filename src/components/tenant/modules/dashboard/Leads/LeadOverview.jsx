import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Mail, Phone, Globe, FileText, ChevronRight, Edit, Trash, Check, MoreVertical } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useParams } from 'react-router-dom';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';
import { editLead } from '../../../../../redux/slice/leadsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addLeadNote,deleteLeadNote } from '../../../../../Intreceptors/LeadsApi';
import ComposeEmailModal from '../email/AddMail';
import { useDropdown } from '../../customer/contact/hooks/Contactshooks';
import { useLeadPermissions } from '../../../authorization/LeadPermissions';
import { validateEmail, validateName, validatePhone,validateNotes } from '../../../../../utils/ValidateFunctions';

const fetchLeadById = async (lead_id) => {
    try {
        const response = await subdomainInterceptors.get("api/lead-overview/",
            {params:{lead_id}}
        )
        
        return response.data;
    }
    catch (error) {
        throw error; 
    }
}

export default function LeadDetailPage() {
  const userId = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);
  const [activeTab, setActiveTab] = useState('notes');
  const [leads, setLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [change, setChange] = useState(false);
  const [error, setError] = useState('');
  const {lead_id} = useParams();
  const dispatch = useDispatch();
  const { isOpen, toggle, open, close } = useDropdown();
  const {canEditLead} = useLeadPermissions();
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone_number: ''
  });

  // Success and error messages for lead editing
  const [editStatus, setEditStatus] = useState({
    success: false,
    error: false,
    message: '',
    loading: false
  });

  // Initialize leadData with proper structure
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone_number: "",
    status: "",
    notes: [],
    custome_fields: {},
  });

  useEffect(() => {
    const fetchLead = async () => {
      const lead = await fetchLeadById(lead_id);
      setLead(lead);
    };
  
    fetchLead(); 
  }, [lead_id, change]);

  useEffect(() => {
    if (leads) {
      setLeadData({
        name: leads.name || "",
        email: leads.email || "",
        phone_number: leads.phone_number || "",
        status: leads.status || "",
        notes: leads.notes || [],
        tasks: leads.tasks || [],
        custome_fields: { ...leads.custome_fields },
      });
    }
  }, [leads]);

  // Validation function
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'phone_number':
        return validatePhone(value);
      default:
        return null;
    }
  }, []);

  // Enhanced change handler with validation
  const handleChange = useCallback((e) => {
    const {name, value} = e.target;
    

    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Clear edit status when user starts editing
    if (editStatus.success || editStatus.error) {
      setEditStatus({
        success: false,
        error: false,
        message: '',
        loading: false
      });
    }

    if (name.startsWith("custom_")) {
      const key = name.replace("custom_", "");
      setLeadData((prev) => ({
        ...prev,
        custome_fields: {
          ...prev.custome_fields,
          [key]: value,
        },
      }));
    } else {
      setLeadData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, [editStatus]);

  // Validate form on blur
  const handleBlur = useCallback((e) => {
    const {name, value} = e.target;
    
    if (['name', 'email', 'phone_number'].includes(name)) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [validateField]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const errors = {
      name: validateField('name', leadData.name),
      email: validateField('email', leadData.email),
      phone_number: validateField('phone_number', leadData.phone_number)
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  }, [leadData, validateField]);

  const handleEdit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Reset previous status
    setEditStatus({
      success: false,
      error: false,
      message: '',
      loading: true
    });
    
    const updatedata = {
      ...leadData,
      lead_id: leads.lead_id
    };

    try {
      await dispatch(editLead(updatedata)).unwrap();
      
      // Success handling
      setEditStatus({
        success: true,
        error: false,
        message: 'Lead updated successfully!',
        loading: false
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setEditStatus(prev => ({ ...prev, success: false, message: '' }));
      }, 3000);

      // Trigger data refresh
      setChange(!change);
      
    } catch (error) {
      // Error handling
      setEditStatus({
        success: false,
        error: true,
        message: error.message || 'Failed to update lead. Please try again.',
        loading: false
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setEditStatus(prev => ({ ...prev, error: false, message: '' }));
      }, 5000);
    }
  };
  
  const handleNoteSubmit = async() => {
    const worderror = validateNotes(noteText);
    if (worderror) {
      setError(worderror);
      return;
    }
    
    const created_by = role !== 'owner' ? userId : null;
    const data = {
      created_by: created_by,
      lead: lead_id,
      notes: noteText
    };
    
    try {
      const res = await addLeadNote(data);
      setNoteText("");
      setError("");
      setChange(!change);
    } catch (error) {
      setError('Failed to add note. Please try again.');
    }
  };
  const handleDeleteNote = async(id) => {
    const data = {
      notes_id : id,
    }
    try {
      const res = await deleteLeadNote(data);
      setChange(!change);
      } catch (error) {
        setError('Failed to delete note. Please try again.');
        }
      }

  // Show loading state while leads data is being fetched
  if (!leads) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div>Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Lead Overview</h1>
              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                  <Phone size={16} className="mr-2" /> Call
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50" onClick={toggle}>
                  <Mail size={16} className="mr-2" /> Email
                </button>
              </div>
            </div>

            { isOpen &&(
              <ComposeEmailModal
              contacts={leads}
              onClose={close}
              isOpen={isOpen}
              isType = {true}
              manualType="lead"
              />
            )}

            {/* Lead Profile Card */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {leads?.avatar}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{leads?.name}</h2>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {leads?.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  <div>
                    <DetailItem label="Email" value={leads?.email} />
                    <DetailItem label="Phone" value={leads?.phone_number} />
                  </div>
                  <div>
                    <DetailItem label="Lead Source" value={leads?.status} />
                    <DetailItem label="Lead Owner" value={leads?.employee?.name} />
                    <DetailItem label="Created Date" value={leads?.created_at?.split('T')[0]} />
                  </div>
                  
                  {leads?.custome_fields &&
                    Object.entries(leads.custome_fields).map(([key, value]) => (
                      <DetailItem key={key} label={key} value={value} />
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <TabButton 
                    text="Notes" 
                    active={activeTab === 'notes'} 
                    onClick={() => setActiveTab('notes')} 
                  />
                  <TabButton 
                    text="Tasks" 
                    active={activeTab === 'tasks'} 
                    onClick={() => setActiveTab('tasks')} 
                  />
                  <TabButton 
                    text="Edit Lead" 
                    active={activeTab === 'edit'} 
                    onClick={() => setActiveTab('edit')} 
                  />
                </nav>
              </div>

              <div className="p-6">
                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div>
                    <div className="flex mb-4">
                      <input
                        value={noteText}
                        type="text"
                        placeholder="Add a note..."
                        className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
                        onChange={(e) => setNoteText(e.target.value)}
                      />
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleNoteSubmit}
                      >
                        Add Note
                      </button>
                    </div>
                    
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                      </div>
                    )}

                    {leadData.notes?.map(note => (
                      <div key={note.id} className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-gray-500">
                              {note.created_by?.name || "Owner"} ({note.created_by?.role?.name}) · {new Date(note.created_at).toLocaleString()}
                            </div>
                            <div className="mt-2 text-sm text-gray-900">
                              {note.notes}
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-500" onClick={()=>handleDeleteNote(note.id)}>
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div>
                    {(leadData?.tasks).map(task => (
                      <div key={task.id} className="flex items-center p-4 border border-gray-200 rounded-md mb-3 bg-white">
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          className="w-5 h-5 mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className={`font-medium ${task.status ==="COMPLETED" ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            {task.priority === 'URGENT' && (
                              <span className="ml-2 text-red-600 text-sm font-medium">(High Priority)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.completed ? 'Completed: ' : 'Due: '}
                            {task.duedate} 
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                              {task.assigned_to_employee?.name || task.assigned_to_team?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!leads?.tasks || leads.tasks.length === 0) && (
                        <p className="text-center text-gray-500 py-4">No tasks found.</p>
                    )}
                  </div>
                )}

                {/* Edit Tab with Validation */}
                {activeTab === 'edit' && canEditLead && (
                  <div>
                    {/* Success Message */}
                    {editStatus.success && (
                      <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        {editStatus.message}
                      </div>
                    )}

                    {/* Error Message */}
                    {editStatus.error && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {editStatus.message}
                      </div>
                    )}

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleEdit}>
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-2 border rounded-md ${
                            validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                          }`}
                          value={leadData.name}
                        />
                        {validationErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                        )}
                      </div>
                      
                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-2 border rounded-md ${
                            validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                          }`}
                          value={leadData.email}
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                      </div>
                      
                      {/* Phone Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full p-2 border rounded-md ${
                            validationErrors.phone_number ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                          }`}
                          value={leadData.phone_number}
                        />
                        {validationErrors.phone_number && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.phone_number}</p>
                        )}
                      </div>
                      
                      {/* Status Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lead Status
                        </label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-md bg-white"
                          name="status"
                          onChange={handleChange}
                          value={leadData.status}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Negotiation">Negotiation</option>
                        </select>
                      </div>
                      
                      {/* Custom Fields */}
                      {leadData.custome_fields && Object.entries(leadData.custome_fields).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {key}
                          </label>
                          <input
                            type="text"
                            name={`custom_${key}`}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={value}
                          />
                        </div>
                      ))}
                      
                      {/* Action Buttons */}
                      <div className="md:col-span-3 flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setActiveTab('notes')}
                          disabled={editStatus.loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          disabled={Object.values(validationErrors).some(error => error) || editStatus.loading}
                        >
                          {editStatus.loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const TabButton = ({ text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium ${
      active
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {text}
  </button>
);

const DetailItem = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-xs text-gray-500 uppercase font-medium mb-1">{label}</p>
    <p className="text-gray-800">{value}</p>
  </div>
);