import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Plus, ChevronDown, User, Phone, Mail, ExternalLink, MoreVertical, Check, Trash2, MailIcon, UserPlus, X, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts, deleteAccounts } from '../../../../redux/slice/AccountsSlice';
import userprofile from "../../../../assets/user-profile.webp";
import { useNavigate } from 'react-router-dom';
import { UserDropdown } from '../../../common/ToolBar';
import { assignUserToAccount } from '../../../../Intreceptors/CustomerApi';
import { useToast } from '../../../common/ToastNotification';
import { MassMail } from '../../../../Intreceptors/MassMailapi';
import { CategoryDropdown } from '../../../common/EmailCategory';


// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Action configurations
const ACTION_CONFIGS = {
  mass_email: {
    title: "Send Mass Email",
    message: "Are you sure you want to send an email to the selected contacts?",
    icon: <MailIcon size={18} className="text-blue-500" />
  },
  assign: {
    title: "Assign Contacts", 
    message: "Are you sure you want to reassign the selected contacts?",
    icon: <UserPlus size={18} className="text-green-500" />
  },
  delete: {
    title: "Delete Contacts",
    message: "Are you sure you want to delete the selected contacts? This action cannot be undone.",
    icon: <Trash2 size={18} className="text-red-500" />
  }
};

const getStatusBadgeStyle = (status) => {
  const styles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800', 
    prospect: 'bg-blue-100 text-blue-800'
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

// // Confirmation Modal Component
const ConfirmationModal = ({ isOpen, action, onConfirm, onCancel }) => {
  if (!isOpen || !action) return null;
  
  const config = ACTION_CONFIGS[action];
  
  return (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b rounded-t-lg">
          <div className="flex items-center">
            {config.icon}
            <h3 className="ml-2 text-lg font-medium text-gray-900">{config.title}</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-4 py-4">
          <div className="flex items-start">
            <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-gray-700">{config.message}</p>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Actions Menu Component
const ActionsMenu = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;
  
  const actions = [
    { key: 'mass_email', label: 'Mass Email', icon: MailIcon },
    { key: 'assign', label: 'Assign', icon: UserPlus },
    { key: 'delete', label: 'Delete', icon: Trash2, className: 'text-red-600 hover:bg-red-50' }
  ];
  
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
      <div className="py-1">
        {actions.map(({ key, label, icon: Icon, className = 'hover:bg-gray-100' }) => (
          <button
            key={key}
            className={`flex items-center w-full px-4 py-2 text-sm ${className}`}
            onClick={() => onAction(key)}
          >
            <Icon size={14} className="mr-2" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function AccountList() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [assignedTo, setAssignedTo] = useState();
  const [change, setChange] = useState(false);
  const ACCOUNT_STATUSES = ['active', 'inactive', 'prospect'];
  const STATUS_COLORS = {
  active: "text-green-600",
  inactive: "text-red-600",
  prospect: "text-yellow-500",
};

  const [dropdownStates, setDropdownStates] = useState({
    user: false,
    emailCategory: false
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Redux and hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const role = useSelector(state => state.auth.role);
  const userId = useSelector(state => state.profile.id);
  const { accounts, next, previous, loading, error } = useSelector(state => state.accounts);
  const subdomain = localStorage.getItem("subdomain");

  // Fetch accounts with backend search/filter
  const fetchAccountsData = useCallback((params = {}) => {
    const payload = {
      ...(role !== 'owner' && { userId }),
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...params
    };
    dispatch(fetchAccounts(payload));
  }, [dispatch, role, userId, debouncedSearchTerm, statusFilter]);

  // Effects
  useEffect(() => {
    fetchAccountsData();
  }, [fetchAccountsData, change]);

  // Handlers
  const handleNext = () => next && fetchAccountsData({ url: next });
  const handlePrevious = () => previous && fetchAccountsData({ url: previous });

  const toggleSelection = (accountId) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const selectAllAccounts = () => {
    setSelectedAccounts(prev => 
      prev.length === accounts.length ? [] : accounts.map(account => account.id)
    );
  };

  const updateDropdownState = (dropdown, isOpen) => {
    setDropdownStates(prev => ({ ...prev, [dropdown]: isOpen }));
  };

  const handleActionClick = (action) => {
    setActionToConfirm(action);
    setShowActions(false);
    
    switch (action) {
      case 'assign':
        updateDropdownState('user', true);
        break;
      case 'mass_email':
        updateDropdownState('emailCategory', true);
        break;
      default:
        setShowConfirmation(true);
    }
  };

  const handleUserSelect = (user) => {
    setAssignedTo(user.id);
    updateDropdownState('user', false);
    setShowConfirmation(true);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateDropdownState('emailCategory', false);
    setShowConfirmation(true);
  };

  const handleBulkAction = async (action) => {
    try {
      switch (action) {
        case 'delete':
          dispatch(deleteAccounts(selectedAccounts));
          break;
          
        case 'mass_email':
          await MassMail(
            { to_accounts: selectedAccounts, category: selectedCategory },
            { userId, role, dispatch, showError, showSuccess }
          );
          break;
          
        case 'assign':
          const response = await assignUserToAccount({
            assigned_to: assignedTo,
            assigned_by: role === "owner" ? null : userId,
            account_id: selectedAccounts
          });
          
          if (response.status === 200) {
            setChange(!change);
            showSuccess(response.data.message);
          }
          break;
      }
      setSelectedAccounts([]);
    } catch (error) {
      showError('Action failed. Please try again.');
    }
  };

  const handleConfirm = () => {
    handleBulkAction(actionToConfirm);
    setShowConfirmation(false);
    setActionToConfirm(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setActionToConfirm(null);
  };

  const handleAccountDetail = (account) => {
    navigate(`/${subdomain}/dashboard/customer/accounts/${account.id}/`);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
              {selectedAccounts.length > 0 && (
                <span className="ml-3 text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {selectedAccounts.length} selected
                </span>
              )}
            </div>
            
            {selectedAccounts.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)} 
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
                
                <ActionsMenu 
                  isOpen={showActions}
                  onClose={() => setShowActions(false)}
                  onAction={handleActionClick}
                />
                
                {/* Dropdowns */}
                <UserDropdown 
                  isOpen={dropdownStates.user} 
                  onSelect={handleUserSelect} 
                  onClose={() => updateDropdownState('user', false)} 
                />
                
                <CategoryDropdown
                  isOpen={dropdownStates.emailCategory}
                  onSelect={handleCategorySelect}
                  onClose={() => updateDropdownState('emailCategory', false)}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="md:w-1/3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search accounts..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={accounts.length > 0 && selectedAccounts.length === accounts.length}
                    onChange={selectAllAccounts}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : accounts.length > 0 ? (
                accounts.map((account) => (
                  <tr 
                    key={account.id} 
                    className={`hover:bg-gray-50 ${selectedAccounts.includes(account.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={() => toggleSelection(account.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleAccountDetail(account)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {account.name}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(account.status)}`}>
                        {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Mail size={14} className="mr-1" />
                          <a href={`mailto:${account.email}`} className="hover:text-blue-600">
                            {account.email}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Phone size={14} className="mr-1" />
                          <span>{account.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={userprofile} alt="" className="h-6 w-6 rounded-full mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {account.assigned_to?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(account.updated_at).toLocaleDateString()}
                    </td>
          
                  <td className="relative">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === account.id ? null : account.id)}
                          className="p-2 rounded hover:bg-gray-100"
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>

                        {openDropdownId === account.id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white  rounded-md shadow-lg z-10 dropdown-menu">
                            {ACCOUNT_STATUSES.filter(status => status !== account.status).map(status => (
                              <button
                                  key={status}
                                  onClick={() => handleStatusChange(account.id, status)}
                                  className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100 ${STATUS_COLORS[status]}`}
                                >
                                                              Mark as {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>


                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No accounts found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePrevious}
              disabled={!previous}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!next}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{accounts.length}</span> results
              </p>
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={handlePrevious}
                disabled={!previous}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronDown size={16} className="transform rotate-90" />
              </button>
              <button
                onClick={handleNext}
                disabled={!next}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronDown size={16} className="transform -rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        action={actionToConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DashboardLayout>
  );
}