import { useEffect, useState } from 'react';
import { 
  Bell, 
  Calendar, 
  BarChart2, 
  DollarSign, 
  FileText, 
  Phone, 
  Plus, 
  Users, 
  Globe, 
  Mail, 
  MapPin, 
  Building, 
  Pencil, 
  Trash, 
  MoreVertical,
  X,
  Save,
  Settings,
  User,
  Edit
} from 'lucide-react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { useParams } from 'react-router-dom';
import { fetchAccountByID } from '../../../../Intreceptors/CustomerApi';
import CustomFieldModal from './CustomeField';
import { addCustomFields, deleteCustomFields, AddNote } from '../../../../Intreceptors/CustomerApi';
import { useSelector, useDispatch } from 'react-redux';
import { updateAccount } from '../../../../redux/slice/AccountsSlice';
import { useDropdown } from './contact/hooks/Contactshooks';
import ComposeEmailModal from '../dashboard/email/AddMail';

export default function AccountDetail() {
  const [activeTab, setActiveTab] = useState('Deals');
  const { account_id } = useParams();
  const [accounts, setAccount] = useState(null);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [deletedKey, setDeletedKey] = useState(null);
  const [noteText, setNoteText] = useState('');
  const userId = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);
  const [change, setChange] = useState(false);
  const dispatch = useDispatch();
  const { isOpen, toggle, open, close } = useDropdown();

  // Edit form state
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: ''
  });
  const [editFormErrors, setEditFormErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAccountByID(account_id); 
        setAccount(res);
        setCustomFields(res?.custome_fields || {});
        
        // Initialize edit form with current data
        setEditFormData({
          name: res?.name || '',
          email: res?.email || '',
          phone_number: res?.phone_number || '',
          address: res?.address || ''
        });
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    };

    fetchData();
  }, [account_id, change]);
  
  const [error, setError] = useState('');
  
  const handleNoteSubmit = async() => {
    const wordCount = noteText.trim().split(/\s+/).length;
    if (wordCount < 5) {
      setError("Note must be at least 5 words.");
      return;
    }
    
    const created_by = role !== 'owner' ? userId : null;
    const data = {
      created_by: created_by,
      account: account_id,
      notes: noteText
    };
    
    const res = await AddNote(data);
    setNoteText("");
    setError("");
    setChange(!change);
  };
  
  const addCustomField = async () => {
    if (newFieldName.trim() === '') return;

    const newField = {
      key: newFieldName,
      value: newFieldValue,
    };

    await addCustomFields(account_id, newField);

    setNewFieldName('');
    setNewFieldValue('');
    setShowCustomFieldModal(false);
    setChange((prev) => !prev); 
  };

  const deleteCustomField = async (key) => {
    const data = { key: key };
    await deleteCustomFields(account_id, data); 
    setChange((prev) => !prev); 
  };

  const startEditingField = (key, value) => {
    setEditingField({
      key: key,   
      name: key,  
      value: value,
      is_Editing: true 
    });
  };
  
  const saveEditedField = async () => {
    if (!editingField) return;
    
    await addCustomFields(account_id, editingField);
    setEditingField(null);
    setChange((prev) => !prev); 
  };

  // Edit form validation
  const validateEditForm = () => {
    const errors = {};
    
    if (!editFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!editFormData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    }
    
    return errors;
  };

  // Handle edit form input changes
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (editFormErrors[field]) {
      setEditFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle edit form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const updateData = {
        id: account_id,
        ...editFormData
      };
      
      await dispatch(updateAccount(updateData));
      setEditMode(false);
      setChange(!change); // Refresh the data
    } catch (error) {
      console.error('Error updating account:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditFormData({
      name: accounts?.name || '',
      email: accounts?.email || '',
      phone_number: accounts?.phone_number || '',
      address: accounts?.address || ''
    });
    setEditFormErrors({});
  };

  const openTasks = accounts?.tasks || [];

  const stats = {
    openDeals: accounts?.deals?.filter(opp => opp.stage !== "Closed Won" && opp.stage !== "Closed Lost").length,
    totalValue: accounts?.deals?.reduce((sum, opp) => sum + opp.amount, 0),
    contactCount: accounts?.contacts.length,
    openTaskCount: openTasks.filter(task => task.status !== "COMPLETED").length
  };

  return (
    <DashboardLayout>
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{accounts?.name }</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              accounts?.status === 'active' ? 'bg-green-100 text-green-800' : 
              accounts?.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {accounts?.status.charAt(0).toUpperCase() + accounts?.status.slice(1)}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            onClick={toggle}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
            
            {/* <div className="relative inline-block text-left">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <MoreVertical className="h-4 w-4" />
              </button>
              
            </div> */}
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Deals</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.openDeals}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">${stats?.totalValue?.toLocaleString()}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Contacts</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.contactCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Tasks</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.openTaskCount}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        { isOpen &&(
                            <ComposeEmailModal
                            contacts={accounts}
                            onClose={close}
                            isOpen={isOpen}
                            isType = {true}
                            manualType="account"
                            />
                          )}
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Account Information</h3>
                <button 
                  onClick={() => setShowCustomFieldModal(true)}
                  className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {/* Default fields */}
                   <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>Name:</span>
                    </div>
                    <a href={`mailto:${accounts?.name}`} className="mt-1 text-sm text-blue-600 hover:text-blue-800">{accounts?.name}</a>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>Email:</span>
                    </div>
                    <a href={`mailto:${accounts?.email}`} className="mt-1 text-sm text-blue-600 hover:text-blue-800">{accounts?.email}</a>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>Phone:</span>
                    </div>
                    <a href={`tel:${accounts?.phone_number}`} className="mt-1 text-sm text-blue-600 hover:text-blue-800">{accounts?.phone_number}</a>
                  </div>
                  
                  
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>Address:</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900">{accounts?.address}</p>
                  </div>
                  
                  {/* Custom Fields Section */}
                  {customFields && Object.keys(customFields).length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Settings className="h-4 w-4 mr-1 text-gray-400" />
                            Custom Fields
                          </h4>
                          <div className="space-y-4">
                            {Object.entries(customFields).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-start group">
                                {editingField && editingField.key === key ? (
                                  <div className="w-full">
                                    <div className="flex gap-2 mb-1">
                                      {/* Input for editing the field name */}
                                      <input 
                                        type="text" 
                                        value={editingField.name}
                                        onChange={(e) => setEditingField({...editingField, name: e.target.value})}
                                        className="text-sm border-gray-300 rounded-md shadow-sm w-full"
                                        placeholder="Field name"
                                      />
                                      {/* Save Button */}
                                      <button 
                                        onClick={saveEditedField}
                                        className="p-1 text-green-600 hover:text-green-800"
                                      >
                                        <Save className="h-4 w-4" />
                                      </button>
                                      {/* Cancel Button */}
                                      <button 
                                        onClick={() => setEditingField(null)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <input 
                                      type="text" 
                                      value={editingField.value}
                                      onChange={(e) => setEditingField({...editingField, value: e.target.value})}
                                      className="text-sm border-gray-300 rounded-md shadow-sm w-full"
                                      placeholder="Field value"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <div className="text-sm text-gray-500">{key}:</div>
                                      <p className="mt-1 text-sm text-gray-900">{value}</p>
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => startEditingField(key, value)}
                                        className="p-1 text-blue-600 hover:text-blue-800"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </button>

                                      <button 
                                        onClick={() => deleteCustomField(key)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                </div>
              </div>
            </div>
            {/* Contacts Section */}
            <div className="bg-white shadow rounded-lg">
  <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
    <h3 className="text-lg font-medium leading-6 text-gray-900">Contacts</h3>
    <button className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700">
      <Plus className="h-5 w-5" />
    </button>
  </div>
  <div className="px-4 py-5 sm:p-6">
    <div className="space-y-4">
      {(accounts?.contacts || []).map(contact => (
        <div key={contact.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{contact.name}</h4>
              <p className="text-xs text-gray-500">{contact.department}</p>
            </div>
            {contact.is_primary_contact && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Primary
              </span>
            )}
          </div>
          <a href={`mailto:${contact.email}`} className="block mt-1 text-sm text-blue-600 hover:text-blue-800">{contact.email}</a>
          <a href={`tel:${contact.phone_number}`} className="block mt-1 text-sm text-blue-600 hover:text-blue-800">{contact.phone_number}</a>
        </div>
      ))}
      {(!accounts?.contacts || accounts.contacts.length === 0) && (
        <p className="text-center text-gray-500 py-4">No contacts found.</p>
      )}
    </div>
  </div>
</div>
          </div>
          
          {/* Right Column - Tabs for Deals, Tasks, Notes, Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                   {/* <button
                    onClick={() => setActiveTab('contacts')}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'contacts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Contacts
                  </button> */}
                  <button
                    onClick={() => setActiveTab('Deals')}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'Deals'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Deals
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'tasks'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tasks
                  </button>
                 
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'notes'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'activity'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Edit Account
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
               
                {activeTab === 'Deals' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Deals</h3>
                      {/* <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-1" />
                        New Opportunity
                      </button> */}
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {accounts?.deals?.map((opportunity) => (
                            <tr key={opportunity.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{opportunity.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opportunity.stage}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${opportunity.amount.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(opportunity.closeDate).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opportunity.probability}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
                      
                    </div>
                    
                    <div className="space-y-4">
                      {(accounts?.tasks || []).map((task) => (
                        <div key={task.id} className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 mt-1"
                                checked={task.status === 'COMPLETED'}
                                readOnly
                              />
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                  {task.title}
                                </p>
                                <div className="mt-1 flex items-center space-x-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Due: {new Date(task.duedate).toLocaleDateString()}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      ))}
                      {(!accounts?.tasks || accounts.tasks.length === 0) && (
                        <p className="text-center text-gray-500 py-4">No tasks found.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Notes Tab */}
                
                {activeTab === 'notes' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Add Note</h3>
                      <div>
                        <textarea
                          rows={3}
                          value={noteText}
                          className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                          onChange={(e)=>setNoteText(e.target.value)}
                          placeholder="Write a note..."
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <div className="mt-2 flex justify-end">
                          <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                           onClick={handleNoteSubmit}>
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {accounts.notes.map((note) => (
                        <div key={note.id} className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm text-gray-500">
                                {note.created_by?.name|| "Owner"}({note.created_by?.role.name}) · {new Date(note.created_at).toLocaleString()}
                              </div>
                              <div className="mt-2 text-sm text-gray-900">
                                {note.notes}
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-500">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Activity Tab */}
                {/* Edit Account Tab */}
                {activeTab === 'edit' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Account Information</h3>
                    
                    <form onSubmit={handleEditFormSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Account Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={editFormData.name}
                            onChange={(e) => handleEditFormChange('name', e.target.value)}
                            className={`mt-1 block w-full shadow-sm sm:text-sm border rounded-md px-3 py-2 ${
                              editFormErrors.name 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter account name"
                          />
                          {editFormErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{editFormErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={editFormData.email}
                            onChange={(e) => handleEditFormChange('email', e.target.value)}
                            className={`mt-1 block w-full shadow-sm sm:text-sm border rounded-md px-3 py-2 ${
                              editFormErrors.email 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter email address"
                          />
                          {editFormErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{editFormErrors.email}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone_number"
                            value={editFormData.phone_number}
                            onChange={(e) => handleEditFormChange('phone_number', e.target.value)}
                            className={`mt-1 block w-full shadow-sm sm:text-sm border rounded-md px-3 py-2 ${
                              editFormErrors.phone_number 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter phone number"
                          />
                          {editFormErrors.phone_number && (
                            <p className="mt-1 text-sm text-red-600">{editFormErrors.phone_number}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            value={editFormData.address}
                            onChange={(e) => handleEditFormChange('address', e.target.value)}
                            className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter address"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Update Account
                            </>
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
    </div>
    <CustomFieldModal
      isOpen={showCustomFieldModal}
      onClose={() => setShowCustomFieldModal(false)}
      onAddField={addCustomField}
      newFieldName={newFieldName}
      setNewFieldName={setNewFieldName}
      newFieldValue={newFieldValue}
      setNewFieldValue={setNewFieldValue}
    />
    </DashboardLayout>
  );
}