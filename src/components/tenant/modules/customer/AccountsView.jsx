import { useEffect, useState } from 'react';
import { Search, Plus, ChevronDown, User, Phone, Mail, ExternalLink } from 'lucide-react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { useSelector,useDispatch } from 'react-redux';
import { fetchAccounts } from '../../../../redux/slice/AccountsSlice';
import userprofile from "../../../../assets/user-profile.webp";


export default function AccountList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const dispatch = useDispatch();
  const {accounts, next, previous,loading, error} = useSelector(state => state.accounts);

  useEffect(()=>{
    dispatch(fetchAccounts())
  },[])

   const handleNext = () => {
      console.log(next)
      dispatch(fetchAccounts(next));
      };
      const handlePrevious = () => {
        dispatch(fetchAccounts(previous));
        };
  const filteredAccounts = accounts
    .filter(account => {
      // Filter by search term
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected column
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
  
  return (
    <DashboardLayout>
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          
          <div className="flex space-x-2">
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
      
      {/* Filters */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          {/* Search */}
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
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      <a href={`/accounts/${account.id}`} className="hover:underline">
                        {account.name}
                      </a>
                    </div>
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
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
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
              onClick={handlePrevious}>
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