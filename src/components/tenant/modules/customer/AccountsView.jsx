import { useEffect, useState,useRef} from 'react';
import { Search, Plus, ChevronDown, User, Phone, Mail, ExternalLink, MoreVertical, Check,Trash2,MailIcon,UserPlus,X,AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts,deleteAccounts } from '../../../../redux/slice/AccountsSlice';
import userprofile from "../../../../assets/user-profile.webp";
import { useNavigate } from 'react-router-dom';
import { UserDropdown } from '../../../common/ToolBar';
import { assignUserToAccount } from '../../../../Intreceptors/CustomerApi';
import { useToast } from '../../../common/ToastNotification';
import { MassMail } from '../../../../Intreceptors/MassMailapi';
import { CategoryDropdown } from '../../../common/EmailCategory';



export default function AccountList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [isuserDropdown,setUserDropdown]= useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [assignedTo, setAssignedTo]= useState()
  const[change, setChange]=useState(false)
  const confirmationRef = useRef(null);
  const role = useSelector((state) =>state.auth.role)
  const userId = useSelector((state) =>state.profile.id)
  const { showSuccess, showError } = useToast();
  const [emailCategory, setEmailCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {accounts, next, previous, loading, error} = useSelector(state => state.accounts);
  console.log(accounts);
  
  const actionConfigs = {
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
  
  useEffect(() => {
    dispatch(fetchAccounts())
  }, [dispatch,change]);

  const handleNext = () => {
    console.log(next)
    dispatch(fetchAccounts(next));
  };
  
  const handlePrevious = () => {
    dispatch(fetchAccounts(previous));
  };
  const SelectedUser = (user) => {
    setAssignedTo(user.id)
    setUserDropdown(false);

    setShowConfirmation(true);

  }
  const filteredAccounts = accounts
    .filter(account => {
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === 'location') {
        comparison = `${a.city}, ${a.state}`.localeCompare(`${b.city}, ${b.state}`);
      } else if (sortBy === 'updated_at') {
        comparison = new Date(a.updated_at) - new Date(b.updated_at);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const toggleSelection = (accountId) => {
    if (selectedAccounts.includes(accountId)) {
      setSelectedAccounts(selectedAccounts.filter(id => id !== accountId));
    } else {
      setSelectedAccounts([...selectedAccounts, accountId]);
    }
  };
  
  const selectAllAccounts = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map(account => account.id));
    }
  };
  const handleActionClick = (action) => {
    setActionToConfirm(action);
    
    if (action === 'assign') {
      console.log("12");
      
      setUserDropdown(true);
      
    } 
    else if(action === 'mass_email'){
      setEmailCategory(true)

    }
    else {
      console.log("1233");
      setShowConfirmation(true);
    }
    
    setShowActions(false);
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
  console.log(selectedAccounts);
  
  const handleBulkAction = async(action)=>{
    if (action === "delete"){
      dispatch(deleteAccounts(selectedAccounts))
      setSelectedAccounts([])
    }
    if (action === 'mass_email') {
        console.log("working");
        
        const data = {
          "to_accounts" :selectedAccounts,
          "category":selectedCategory
        }
        const response = MassMail(data,{userId,role,dispatch,showError,showSuccess})
      }
      if (action === 'assign') {
        const data = {'assigned_to':assignedTo,
          'assigned_by':role ==="owner"? null:userId,
          'account_id':selectedAccounts
          }
      console.log(data);
      
      try {
        const response = await assignUserToAccount(data);
        console.log(response);
        console.log(response.status)
        
        if (response.status === 200) {
          ;
          setChange(true);
          showSuccess(response.data.message);

          
        } else {
    
          console.error("Something went wrong:", response);
        }
      } catch (error) {
        console.error(error);
    
      }
      setSelectedAccounts([])
    };
    }
  const handleAccountDetail = (account)=>{
    navigate(`/dashboard/customer/accounts/${account.id}/`)
  }
  
  const selctMailCategory = (category)=>{
    setEmailCategory(false)
    console.log("halooo",category)
    setSelectedCategory(category)
    setShowConfirmation(true)

  }
  
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
          
          <div className="flex items-center space-x-2">
            {selectedAccounts.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)} 
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="py-1">
                      
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={()=>handleActionClick('mass_email')}
                      >
                        <MailIcon size={14} className="mr-2" /> Mass Email
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={()=>handleActionClick('assign')}
                      >
                        <UserPlus size={14} className="mr-2" /> Assign
                      </button>
                      
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={()=>handleActionClick('delete')}
                      >
                        <Trash2 size={14} className="mr-2" /> Delete
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          alert(`Another action on ${selectedAccounts.length} accounts`);
                          setShowActions(false);
                        }}
                      >
                        Bulk Action 2
                      </button>
                    </div>
                  </div>
                )}
                {isuserDropdown && (
                                      <UserDropdown 
                                        isOpen={isuserDropdown} 
                                        onSelect={SelectedUser} 
                                        onClose={() => setUserDropdown(false)} 
                                      />
                                    )}

                            {emailCategory &&(
                                                  <CategoryDropdown
                                                  isOpen={emailCategory}
                                                  onSelect={selctMailCategory}
                                                  onClose={()=>setEmailCategory(false)}/>
                                                )}
              </div>
            )}
            {showConfirmation && actionToConfirm && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div 
            ref={confirmationRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
              <div className="flex items-center">
                {actionConfigs[actionToConfirm].icon}
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  {actionConfigs[actionToConfirm].title}
                </h3>
              </div>
              <button 
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-4 py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle size={20} className="text-amber-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    {actionConfigs[actionToConfirm].message}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3 border-t">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
                  actionToConfirm === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
            
            <button
              onClick={() => window.location.href = '/accounts/new'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              New Account
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="md:w-1/3">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search accounts..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Accounts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={filteredAccounts.length > 0 && selectedAccounts.length === filteredAccounts.length}
                    onChange={selectAllAccounts}
                  />
                </div>
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  <span>Account Name</span>
                  {sortBy === 'name' && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {sortBy === 'status' && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center">
                  <span>Location</span>
                  {sortBy === 'location' && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th 
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('updated_at')}
              >
                <div className="flex items-center">
                  <span>Last Updated</span>
                  {sortBy === 'updated_at' && (
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} 
                    />
                  )}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <tr key={account.id} className={`hover:bg-gray-50 ${selectedAccounts.includes(account.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={() => toggleSelection(account.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={()=>handleAccountDetail(account)}>
                    <div className="text-sm font-medium text-blue-600" >
                      {account.name}
                    </div>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(account.status)}`}>
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.city}, {account.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={userprofile} alt="" className="h-6 w-6 rounded-full mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {account.assigned_to?.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/accounts/${account.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <ExternalLink size={16} />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No accounts found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAccounts.length}</span> of{' '}
              <span className="font-medium">{filteredAccounts.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={handlePrevious}
                disabled={!previous}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                aria-current="page"
                className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </button>
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" 
                onClick={handleNext}
                disabled={!next}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}