import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Eye, Trash2, UserPlus, Search } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { deleteEnquiry, fetchEnquiry } from '../../../../../redux/slice/EnquirySlice';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../../../../Intreceptors/LeadsApi';
import { useToast } from '../../../../common/ToastNotification';
import formatTimeAgo from '../../../../utils/formatTimeAgo';
import userprofile from "../../../../../assets/user-profile.webp";
import { addLeads } from '../../../../../redux/slice/leadsSlice';
import EnquiryDetails from './EnqueryDetail';
import { useEnquiryPermissions } from '../../../authorization/useEnquiryPermissions';

const WebEnquirerComponent = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.enquiry);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);
  const [user, setUser] = useState([]);
  const { showSuccess, showError, showWarning } = useToast();
  const [change, setChange] = useState(false);
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isEnquiryDetails, setIsEnquiryDetails] = useState(false);
  const {canAdd, canEdit, canDelete, canView} = useEnquiryPermissions();

  // Refs for cleanup
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Custom debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchEnquiriesWithSearch = useCallback(async (search = '') => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsSearching(true);
        
      await dispatch(fetchEnquiry(search)).unwrap();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search failed:', error);
        showError('Failed to search enquiries');
      }
    } finally {
      setIsSearching(false);
    }
  }, [dispatch, showError]);


  useEffect(() => {
    fetchEnquiriesWithSearch();
  }, [change]);

  useEffect(() => {
    if (debouncedSearch !== debouncedSearchTerm) {
      setDebouncedSearchTerm(debouncedSearch);
      fetchEnquiriesWithSearch(debouncedSearch);
    }
  }, [debouncedSearch, debouncedSearchTerm, fetchEnquiriesWithSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(role === "owner" ? role : profile.id);
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (role && profile?.id) {
      fetchUser();
    }
  }, [role, profile?.id]);


  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [debouncedSearchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    if (debouncedSearchTerm) {
      fetchEnquiriesWithSearch('');
    }
  }, [debouncedSearchTerm, fetchEnquiriesWithSearch]);

  const toggleSelection = (id) => {
    if (selectedEnquiries.includes(id)) {
      setSelectedEnquiries(selectedEnquiries.filter(item => item !== id));
    } else {
      setSelectedEnquiries([...selectedEnquiries, id]);
    }
  };

  const handleDelete = (id = null) => {
    const deleteAction = id ? deleteEnquiry(id) : deleteEnquiry(selectedEnquiries);
  
    dispatch(deleteAction)
      .unwrap()
      .then((response) => {
        setChange(prev => !prev);
        if (!id) setSelectedEnquiries([]);
        showSuccess(response?.message || "Enquiry deleted successfully");
      })
      .catch((error) => {
        const errorMessage = typeof error === "string" ? error : error?.message || "Something went wrong!";
        showError(errorMessage);
      });
  };

  const handleCreateLeads = (id = null) => {
    if (id) {
      const enquiry = data.find(e => e.web_id === id);
      setCurrentEnquiry(enquiry);
      setShowAssignModal(true);
    } else if (selectedEnquiries.length > 0) {
      setCurrentEnquiry(null);
      setShowAssignModal(true);
    } else {
      showWarning('Please select at least one enquiry');
    }
  };

  const assignLeads = () => {
    if (!selectedUser) {
      showWarning('Please select a user');
      return;
    }
    
    const requestData = currentEnquiry ? {
      "form_data": [currentEnquiry.web_id],
      "employee": selectedUser.id,
      "granted_by": role === "owner" ? null : profile.id
    } : {
      "form_data": selectedEnquiries,
      "employee": selectedUser.id,
      "granted_by": role === "owner" ? null : profile.id
    };
    
    dispatch(addLeads(requestData))
      .unwrap()
      .then((response) => {
        setChange(prev => !prev);
        showSuccess(response.message || response.data?.message);
        
        // Reset modal state
        setSelectedEnquiries([]);
        setCurrentEnquiry(null);
        setSelectedUser(null);
        setShowAssignModal(false);
      })
      .catch((error) => {
        showError(error);
      });
  };


  const displayData = useMemo(() => {

    if (!debouncedSearchTerm.trim()) return data;
    
    return data.filter(enquiry => 
      enquiry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      enquiry.phone_number.includes(debouncedSearchTerm)
    );
  }, [data, debouncedSearchTerm]);


  if (!canView) {
    return (
      <DashboardLayout>
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view Web Enquiery Section.</p>
            <p className="text-gray-500 text-sm mt-2">Please contact your administrator for access.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>


          
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-gray-800">Web Enquiries</h1>
              <p className="text-gray-500 mt-1">Manage and convert web enquiries into leads</p>
            </div>
            
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {canAdd && (
                  <button
                    onClick={() => handleCreateLeads()}
                    disabled={selectedEnquiries.length === 0 || selectedEnquiries.some(id => {
                      const enquiry = displayData.find(e => e.web_id === id);
                      return enquiry && enquiry.lead_created === true;
                    })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      selectedEnquiries.length > 0 && !selectedEnquiries.some(id => {
                        const enquiry = displayData.find(e => e.web_id === id);
                        return enquiry && enquiry.lead_created === true;
                      })
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <UserPlus size={16} />
                    Create Lead
                  </button>
                )}
                
                {canDelete && (
                  <button 
                    onClick={() => handleDelete()}
                    disabled={selectedEnquiries.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      selectedEnquiries.length > 0 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>

              {/* Enhanced Search Input */}
              <div className="relative">
                <Search 
                  size={16} 
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                  }`} 
                />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedEnquiries.length === displayData.length && displayData.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEnquiries(displayData.map(item => item.web_id));
                          } else {
                            setSelectedEnquiries([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                          Loading enquiries...
                        </div>
                      </td>
                    </tr>
                  ) : displayData.length > 0 ? (
                    displayData.map((enquiry) => (
                      <tr key={enquiry.web_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedEnquiries.includes(enquiry.web_id)}
                            onChange={() => toggleSelection(enquiry.web_id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{enquiry.web_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{enquiry.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{enquiry.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{enquiry.phone_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{enquiry.source}</td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          <div className="flex items-center space-x-1">
                            <img
                              src={userprofile}
                              alt="User"
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.granted_by?.name || enquiry.employee ? "Owner" : "-"}
                            </div>
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          <div className="flex items-center space-x-1">
                            <img
                              src={userprofile}
                              alt="User"
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.employee?.name || "-"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatTimeAgo(enquiry.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            {!enquiry.lead_created && canAdd && (
                              <button 
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                onClick={() => handleCreateLeads(enquiry.web_id)}
                              >
                                <UserPlus size={16} />
                              </button>
                            )}
                            {canDelete && (
                              <button 
                                className="text-red-600 hover:text-red-900 flex items-center"
                                onClick={() => handleDelete(enquiry.web_id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            <button 
                              className="text-blue-500 hover:text-blue-700 flex items-center"
                              onClick={() => {
                                setIsEnquiryDetails(true);
                                setCurrentEnquiry(enquiry);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? (
                          <div className="space-y-2">
                            <p>No enquiries found for "{searchTerm}"</p>
                            <button 
                              onClick={clearSearch}
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              Clear search
                            </button>
                          </div>
                        ) : (
                          'No enquiries found'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{displayData.length}</span> of{' '}
                <span className="font-medium">{displayData.length}</span> results
                {searchTerm && (
                  <span className="ml-2 text-gray-500">
                    (filtered from {data.length} total)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          
        
        
        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Assign Lead{currentEnquiry ? '' : 's'}</h3>
                <p className="text-gray-500 mt-1">
                  {currentEnquiry 
                    ? `Creating lead for ${currentEnquiry.name}` 
                    : `Creating ${selectedEnquiries.length} lead${selectedEnquiries.length > 1 ? 's' : ''}`}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedUser?.id || ""}
                    onChange={(e) => {
                      const selected = user.find(u => u.id === Number(e.target.value));
                      setSelectedUser(selected || null);
                    }}
                  >
                    <option value="">Select a user</option>
                    {user.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setShowAssignModal(false);
                    setCurrentEnquiry(null);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={assignLeads}
                >
                  Create & Assign
                </button>
              </div>
            </div>
          </div>
        )}

      
      {isEnquiryDetails && currentEnquiry && (
        <EnquiryDetails 
          isOpen={isEnquiryDetails} 
          details={currentEnquiry} 
          onClose={() => setIsEnquiryDetails(false)} 
        />
      )}
    </DashboardLayout>
  );
};

export default WebEnquirerComponent;