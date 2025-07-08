import React, { useEffect, useState } from 'react';
import { Eye, Download, AlertCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { fetchallBillings } from '../../../../redux/slice/projectadmin/tenantsBillingsSlice';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';




const TenantBillingTable = () => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {bills,error} = useSelector((state) =>
    state.billing)
  useEffect (() =>
    { dispatch(fetchallBillings())
      
    }
  , [])

  
  
  // Sample tenant billing data

  const setOverDue = (tenant) => {
  const today = new Date();
  const dueDate = new Date(tenant.billing_expiry); 
  const overdue = dueDate < today && !tenant.last_billing_status;
  
  return overdue; // true if due date is in the past
}
  const getStatusBadge = (tenant) => {
    const overDue = setOverDue(tenant)
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit";
    switch (tenant.last_billing_status) {
      case 'true':
        return `${baseClasses} bg-green-100 text-green-800`;
      case overDue==='true':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'fasle':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (tenant) => {
    const overDue = setOverDue(tenant)
    switch (tenant.last_billing_status) {
      case 'true':
        return <CheckCircle className="h-3 w-3" />;
      case overDue==='true':
        return <AlertCircle className="h-3 w-3" />;
      case 'false':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
  };

  const handleCloseDetails = () => {
    setSelectedTenant(null);
  };

const handleInvoiceNavigation = (billing_id) => {
  
  
  navigate(`/admin/billings/${billing_id}`);
};


  const downloadBill = (tenantId, tenantName) => {
    
    alert(`Bill for ${tenantName} download started!`);
  };


  const filteredTenants = bills.filter(tenant => {
  const matchesSearch = (tenant.tenant_name || '').toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'all' || String(tenant.last_billing_status) === statusFilter;
  return matchesSearch && matchesStatus;
});


  return (
    <div className="max-w mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Billing Management</h1>
        <p className="text-gray-600">Manage and track billing information for all tenants</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by tenant name or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="true">Paid</option>
              <option value="false">Pending</option>

            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Bill Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors duration-150" >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={()=>handleInvoiceNavigation(tenant.id)} >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tenant.tenant_name}</div>
                      
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${tenant.bill_amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(tenant.last_billed_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${tenant.status === 'overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(tenant.billing_expiry)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(tenant)}>
                      {getStatusIcon(tenant)}
                      <span className="capitalize">{tenant.last_billing_status?'paid':"Not Paid"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(tenant)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors duration-200"
                      >
                        <Eye className="h-3 w-3" />
                        <span>More Info</span>
                      </button>
                      <button
                        onClick={() => downloadBill(tenant.id, tenant.tenant_name)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors duration-200"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tenants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredTenants.length} of {bills.length} tenants
      </div>

      {/* Detailed View Modal */}
      {selectedTenant && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Billing Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Tenant Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{selectedTenant.tenant?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">BillingName:</span>
                      <p className="font-medium">{selectedTenant.tenant_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="font-medium">{selectedTenant.tenant.contact}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{selectedTenant.billing_email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Billing Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Current Amount:</span>
                      <p className="font-bold text-lg text-green-600">${selectedTenant.bill_amount}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">User Count:</span>
                      <p className="font-bold text-lg text-black-600">{selectedTenant.active_count_users}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Bill Date:</span>
                      <p className="font-medium">{formatDate(selectedTenant.last_billed_date)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Due Date:</span>
                      <p className="font-medium">{formatDate(selectedTenant.billing_expiry)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <div className={getStatusBadge(selectedTenant)}>
                        {getStatusIcon(selectedTenant)}
                        <span className="capitalize">{selectedTenant.last_billing_status?'paid':"Not Paid"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => downloadBill(selectedTenant.id, selectedTenant.tenant_name)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Bill</span>
                </button>
                <button
                  onClick={handleCloseDetails}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantBillingTable;