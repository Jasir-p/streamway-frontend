import React, { useEffect, useState } from 'react';
import Layout from '../dashboard/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchallTenants } from '../../../redux/slice/projectadmin/CompanySlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/ToastNotification';
import TeamDetailView from '../../tenant/modules/Team/TeamDetailView';




const Tenants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants, loading, error, next, previous } = useSelector((state) => state.tenants);
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  useEffect(() => {
    dispatch(fetchallTenants());
  }, [dispatch]);

  const viewTenantDetails = (tenantId) => {
    console.log('Navigating to:', `/admin/tenants/${tenantId}`)
    navigate(`/admin/tenants/${tenantId}`)
  };

  // Pagination Handlers
  const handleNextPage = () => {
    if (next) {
      dispatch(fetchallTenants(next));
    }
  };

  const handlePrevPage = () => {
    if (previous) {
      dispatch(fetchallTenants(previous));
    }
  };

  // Status Label
  const StatusLabel = ({ isActive }) => {
    console.log(isActive);
    
    const statusClasses = isActive === true
      ? 'bg-green-100 text-green-800'
      : isActive === false
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';
      
    const label = isActive === true ? 'Active' : isActive === false ? 'Inactive' : 'Pending';
    return <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusClasses}`}>{label}</span>;
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Tenant Management</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
            + Add Tenant
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p>Loading tenants data...</p>
          </div>
        ) : error ? (showError(error)
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenants?.length > 0 ? (
                    tenants.map((tenant) => (
                      <tr key={tenant.id} onClick={() => viewTenantDetails(tenant.id)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4">{tenant.name}</td>
                        <td className="px-6 py-4">{tenant.owner_name}</td>
                        <td className="px-6 py-4">{new Date(tenant.created_on).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{tenant.user_count}</td>
                        <td className="px-6 py-4">{tenant.subscription}</td>
                        <td className="px-6 py-4"><StatusLabel isActive={tenant.is_active} /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10">No tenants found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between py-4">
              <button onClick={handlePrevPage} disabled={!previous} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Previous</button>
              <button onClick={handleNextPage} disabled={!next} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Tenants;
