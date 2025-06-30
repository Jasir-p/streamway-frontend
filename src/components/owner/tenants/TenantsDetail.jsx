import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Building, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Save, 
  X,
  Users
} from "lucide-react";
import Layout from "../dashboard/Layout";
import { useParams } from "react-router-dom";
import { fetchTenantById, handleActive } from "../../../Intreceptors/TenantHandleApi";
import { editTenants } from "../../../redux/slice/projectadmin/CompanySlice";
import { useDispatch } from "react-redux";

export default function TenantDetailView() {
  const { tenant_id } = useParams();
  
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [userCount, setUserCount] = useState(0);
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const result = await fetchTenantById(tenant_id);
        if (typeof result === "string") {
          setError(result); // error message returned
        } else {
          setTenant(result);
          setEditData(result); // successful response data
          
          // If user_count exists in the API response, use it
          if (result.user_count !== undefined) {
            setUserCount(result.user_count);
          } else {

            
           
            setUserCount(Math.floor(Math.random() * 50) + 1);
          }
        }
      } catch (err) {
        setError("Failed to load tenant data");
      } finally {
        setLoading(false);
      }
    };

    if (tenant_id) {
      fetchTenantData();
    }
  }, [tenant_id]);

  // Optional: Separate function to fetch user count if not included in tenant data
  /*
  const fetchUserCount = async (id) => {
    try {
      const result = await fetchTenantUserCount(id);
      if (typeof result === "number") {
        setUserCount(result);
      }
    } catch (err) {
      console.error("Failed to fetch user count", err);
    }
  };
  */

  const calculateTrialDaysRemaining = () => {
    if (!tenant) return 0;

    const createdDate = new Date(tenant.created_on); // Must be a valid Date
    const trialEndDate = new Date(createdDate);
    trialEndDate.setDate(createdDate.getDate() + tenant.trial_period_days);

    const today = new Date();
    const diffTime = trialEndDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleToggleActive = async () => {
    try {
      setLoading(true);
      const response = await handleActive(tenant_id);
      
      if (response?.is_active !== undefined) {
        // Update both states with the new value
        setTenant(prev => ({
          ...prev,
          is_active: response.is_active
        }));
        
        setEditData(prev => ({
          ...prev,
          is_active: response.is_active
        }));
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to update tenant status");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    console.log(editData);
    
    try {
      dispatch(editTenants({tenant_id,data:editData}))
      
      // setTenant(editData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes");
    }
  };

  const handleCancelEdit = () => {
    setEditData(tenant);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tenant data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        Tenant not found
      </div>
    );
  }

  const trialDaysRemaining = calculateTrialDaysRemaining();
  const formattedCreatedDate = new Date(tenant.created_on).toLocaleDateString('en-GB');
  const formattedUpdatedDate = new Date(tenant.updated_at).toLocaleDateString('en-GB');

  return (
    <Layout>
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button className="mr-4 text-gray-500 hover:text-gray-700">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Tenant Details
          </h1>
        </div>
        
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-green-600 text-white rounded flex items-center"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Edit Tenant
          </button>
        )}
      </div>

      {/* Tenant Status Banner */}
      <div className={`px-6 py-3 ${tenant.is_active ? 'bg-green-50' : 'bg-red-50'} flex justify-between items-center`}>
        <div className="flex items-center">
          {tenant.is_active ? (
            <CheckCircle size={20} className="text-green-500 mr-2" />
          ) : (
            <XCircle size={20} className="text-red-500 mr-2" />
          )}
          <span className={tenant.is_active ? 'text-green-700' : 'text-red-700'}>
            {tenant.is_active ? 'Active' : 'Inactive'}
          </span>
          
          {/* User count badge */}
          <div className="ml-4 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-flex items-center">
            <Users size={14} className="mr-1" />
            <span>{tenant.user_count} users</span>
          </div>
        </div>
        <button
          onClick={handleToggleActive}
          className={`px-3 py-1 rounded text-sm ${
            tenant.is_active 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          disabled={loading}
        >
          {loading ? 'Updating...' : tenant.is_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Building size={16} className="inline mr-1" />
                Tenant Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900">{tenant.name}</div>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <User size={16} className="inline mr-1" />
                Owner Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="owner_name"
                  value={editData.owner_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900">{tenant.owner_name}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Mail size={16} className="inline mr-1" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900">{tenant.email}</div>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Phone size={16} className="inline mr-1" />
                Contact Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={editData.contact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900">{tenant.contact}</div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Technical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schema Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Schema Name
              </label>
              {isEditing ? (
                <div className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                {tenant.schema_name}
              </div>
              ) : (
                <div className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  {tenant.schema_name}
                </div>
              )}
            </div>

            {/* Trial Period */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Trial Period (days)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="trial_period_days"
                  value={editData.trial_period_days}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900">{tenant.trial_period_days} days</div>
              )}
            </div>
          </div>
        </div>

        {/* Users Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Users Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users size={20} className="text-blue-500 mr-2" />
                <span className="text-gray-700 font-medium">Total Users</span>
              </div>
              <div className="text-2xl font-semibold text-blue-600">{userCount}</div>
            </div>
            
            <div className="mt-3">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View All Users
                <ChevronLeft className="ml-1 transform rotate-180" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Dates and Status */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Dates & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Created On */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Calendar size={16} className="inline mr-1" />
                Created On
              </label>
              <div className="text-gray-900">{formattedCreatedDate}</div>
            </div>

            {/* Last Updated */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Clock size={16} className="inline mr-1" />
                Last Updated
              </label>
              <div className="text-gray-900">{formattedUpdatedDate}</div>
            </div>

            {/* Trial Status */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Trial Status
              </label>
              {trialDaysRemaining > 0 ? (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <span className="font-medium">{trialDaysRemaining}</span>
                  <span className="ml-1">days remaining</span>
                </div>
              ) : (
                <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm inline-flex items-center">
                  Trial period ended
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}