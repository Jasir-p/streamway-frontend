// import React, { useState, useEffect } from 'react';


// const ProductDisplay = () => (
//   <section>
//     <div className="product">
//       <Logo />
//       <div className="description">
//         <h3>Starter plan</h3>
//         <h5>$20.00 / month</h5>
//       </div>
//     </div>
//     <form action="/create-checkout-session" method="POST">
//       {/* Add a hidden field with the lookup_key of your Price */}
//       <input type="hidden" name="lookup_key" value="{{PRICE_LOOKUP_KEY}}" />
//       <button id="checkout-and-portal-button" type="submit">
//         Checkout
//       </button>
//     </form>
//   </section>
// );

// const SuccessDisplay = ({ sessionId }) => {
//   return (
//     <section>
//       <div className="product Box-root">
//         <Logo />
//         <div className="description Box-root">
//           <h3>Subscription to starter plan successful!</h3>
//         </div>
//       </div>
//       <form action="/create-portal-session" method="POST">
//         <input
//           type="hidden"
//           id="session-id"
//           name="session_id"
//           value={sessionId}
//         />
//         <button id="checkout-and-portal-button" type="submit">
//           Manage your billing information
//         </button>
//       </form>
//     </section>
//   );
// };

// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function Apps() {
//   let [message, setMessage] = useState('');
//   let [success, setSuccess] = useState(false);
//   let [sessionId, setSessionId] = useState('');

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get('success')) {
//       setSuccess(true);
//       setSessionId(query.get('session_id'));
//     }

//     if (query.get('canceled')) {
//       setSuccess(false);
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, [sessionId]);

//   if (!success && message === '') {
//     return <ProductDisplay />;
//   } else if (success && sessionId !== '') {
//     return <SuccessDisplay sessionId={sessionId} />;
//   } else {
//     return <Message message={message} />;
//   }
// }

// const Logo = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     xmlnsXlink="http://www.w3.org/1999/xlink"
//     width="14px"
//     height="16px"
//     viewBox="0 0 14 16"
//     version="1.1"
//   >
//     <defs />
//     <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
//       <g
//         id="0-Default"
//         transform="translate(-121.000000, -40.000000)"
//         fill="#E184DF"
//       >
//         <path
//           d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
//           id="Pilcrow"
//         />
//       </g>
//     </g>
//   </svg>
// );


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
  X
} from "lucide-react";

export default function TenantDetailView({ tenantId=2 }) {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  // Mock function to fetch tenant data - replace with actual API call
  const fetchTenantData = async (id) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call like:
      // const response = await fetch(`/api/tenants/${id}`);
      // const data = await response.json();
      
      // Using mock data for demonstration
      const mockData = {
        id: id,
        name: "Acme Corporation",
        email: "contact@acmecorp.com",
        contact: "+1 (555) 123-4567",
        owner_name: "John Doe",
        created_on: "2024-04-01",
        trial_period_days: 30,
        updated_at: "2024-04-15T14:30:00Z",
        is_active: true,
        schema_name: "acme_corp"
      };
      
      setTimeout(() => {
        setTenant(mockData);
        setEditData(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to load tenant data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId]);

  const calculateTrialDaysRemaining = () => {
    if (!tenant) return 0;
    
    const createdDate = new Date(tenant.created_on);
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
      // In a real app, this would be an API call:
      // await fetch(`/api/tenants/${tenant.id}/toggle-status`, { method: 'POST' });
      
      setTenant({
        ...tenant,
        is_active: !tenant.is_active
      });
    } catch (err) {
      setError("Failed to update tenant status");
    }
  };

  const handleSaveChanges = async () => {
    try {
      // In a real app, this would be an API call:
      // await fetch(`/api/tenants/${tenant.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editData)
      // });
      
      setTenant(editData);
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
  const formattedCreatedDate = new Date(tenant.created_on).toLocaleDateString();
  const formattedUpdatedDate = new Date(tenant.updated_at).toLocaleString();

  return (
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
        </div>
        <button
          onClick={handleToggleActive}
          className={`px-3 py-1 rounded text-sm ${
            tenant.is_active 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {tenant.is_active ? 'Deactivate' : 'Activate'}
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
                <input
                  type="text"
                  name="schema_name"
                  value={editData.schema_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
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
  );
}