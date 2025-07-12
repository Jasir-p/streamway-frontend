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
  User
} from 'lucide-react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { useParams } from 'react-router-dom';
import { fetchAccountByID } from '../../../../Intreceptors/CustomerApi';
import CustomFieldModal from './CustomeField';
import { addCustomFields, deleteCustomFields, AddNote } from '../../../../Intreceptors/CustomerApi';
import { useSelector } from 'react-redux';

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

  // New state for editing account fields
  const [editingAccountField, setEditingAccountField] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAccountByID(account_id); 
        setAccount(res);
        setCustomFields(res?.custome_fields || {});
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

  // New functions for editing account fields
  const startEditingAccountField = (fieldName, fieldValue) => {
    setEditingAccountField({
      fieldName: fieldName,
      value: fieldValue
    });
  };

  const saveEditedAccountField = async () => {
    if (!editingAccountField) return;

    try {
      const updatedData = {
        [editingAccountField.fieldName]: editingAccountField.value
      };
      
      // Call your update account API here
      // await updateAccount(account_id, updatedData);
      
      setEditingAccountField(null);
      setChange((prev) => !prev);
    } catch (error) {
      console.error('Error updating account field:', error);
    }
  };

  const cancelEditingAccountField = () => {
    setEditingAccountField(null);
  };

  // Statistics summaries
  const openTasks = accounts?.tasks || [];
  const stats = {
    openDeals: accounts?.deals?.filter(opp => opp.stage !== "Closed Won" && opp.stage !== "Closed Lost").length,
    totalValue: accounts?.deals?.reduce((sum, opp) => sum + opp.amount, 0),
    contactCount: accounts?.contacts?.length || 0,
    openTaskCount: openTasks.filter(task => task.status !== "COMPLETED").length
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Account Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{accounts?.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                accounts?.status === 'active' ? 'bg-green-100 text-green-800' : 
                accounts?.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {accounts?.status?.charAt(0).toUpperCase() + accounts?.status?.slice(1)}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </button>
              
              <div className="relative inline-block text-left">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
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
                    {/* Editable Name Field */}
                    <div className="flex justify-between items-start group">
                      {editingAccountField && editingAccountField.fieldName === 'name' ? (
                        <div className="w-full">
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Name:</span>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={editingAccountField.value}
                              onChange={(e) => setEditingAccountField({...editingAccountField, value: e.target.value})}
                              className="text-sm border-gray-300 rounded-md shadow-sm flex-1"
                              placeholder="Account name"
                            />
                            <button 
                              onClick={saveEditedAccountField}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={cancelEditingAccountField}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <span>Name:</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-900">{accounts?.name}</p>
                          </div>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditingAccountField('name', accounts?.name)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Editable Email Field */}
                    <div className="flex justify-between items-start group">
                      {editingAccountField && editingAccountField.fieldName === 'email' ? (
                        <div className="w-full">
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Email:</span>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="email" 
                              value={editingAccountField.value}
                              onChange={(e) => setEditingAccountField({...editingAccountField, value: e.target.value})}
                              className="text-sm border-gray-300 rounded-md shadow-sm flex-1"
                              placeholder="Email address"
                            />
                            <button 
                              onClick={saveEditedAccountField}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={cancelEditingAccountField}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <span>Email:</span>
                            </div>
                            <a href={`mailto:${accounts?.email}`} className="mt-1 text-sm text-blue-600 hover:text-blue-800">{accounts?.email}</a>
                          </div>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditingAccountField('email', accounts?.email)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Editable Phone Field */}
                    <div className="flex justify-between items-start group">
                      {editingAccountField && editingAccountField.fieldName === 'phone_number' ? (
                        <div className="w-full">
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Phone:</span>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="tel" 
                              value={editingAccountField.value}
                              onChange={(e) => setEditingAccountField({...editingAccountField, value: e.target.value})}
                              className="text-sm border-gray-300 rounded-md shadow-sm flex-1"
                              placeholder="Phone number"
                            />
                            <button 
                              onClick={saveEditedAccountField}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={cancelEditingAccountField}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <span>Phone:</span>
                            </div>
                            <a href={`tel:${accounts?.phone_number}`} className="mt-1 text-sm text-blue-600 hover:text-blue-800">{accounts?.phone_number}</a>
                          </div>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditingAccountField('phone_number', accounts?.phone_number)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Editable Address Field */}
                    <div className="flex justify-between items-start group">
                      {editingAccountField && editingAccountField.fieldName === 'address' ? (
                        <div className="w-full">
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Address:</span>
                          </div>
                          <div className="flex gap-2">
                            <textarea 
                              value={editingAccountField.value}
                              onChange={(e) => setEditingAccountField({...editingAccountField, value: e.target.value})}
                              className="text-sm border-gray-300 rounded-md shadow-sm flex-1 min-h-[60px]"
                              placeholder="Address"
                            />
                            <div className="flex flex-col gap-1">
                              <button 
                                onClick={saveEditedAccountField}
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={cancelEditingAccountField}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <span>Address:</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-900">{accounts?.address}</p>
                          </div>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => startEditingAccountField('address', accounts?.address)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
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
                                    <input 
                                      type="text" 
                                      value={editingField.name}
                                      onChange={(e) => setEditingField({...editingField, name: e.target.value})}
                                      className="text-sm border-gray-300 rounded-md shadow-sm w-full"
                                      placeholder="Field name"
                                    />
                                    <button 
                                      onClick={saveEditedField}
                                      className="p-1 text-green-600 hover:text-green-800"
                                    >
                                      <Save className="h-4 w-4" />
                                    </button>
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
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}