import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';
import ExactToolbar from '../../../../common/ToolBar';
import userprofile from "../../../../../assets/user-profile.webp";
import formatTimeAgo from '../../../../utils/formatTimeAgo';
import { useNavigate } from 'react-router-dom';
import { useHasPermission } from '../../../../utils/PermissionCheck';
import ConversionPermissionPopup from './ConvertPopup';
import StatusDropdown from '../../../../common/StatusComponent';


const MondayStyleLeadsTable = () => {
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leads, loading, error, next, previous } = useSelector((state) => state.leads);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const userId = useSelector((state) => state.profile.id);
  const [search, setSearch] = useState("");
  const [change, setChange] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [status, setStatus] = useState(false);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    assigned_to: '',
    location: ''
  });

  const hasAddLeadPermission = useHasPermission('add_leads');
  const canAddLead = hasAddLeadPermission || role === "owner";
  const hasEditLeadsPermission = useHasPermission("edit_leads");
  const canEditLead = selectedLeads?.length > 0 && (hasEditLeadsPermission || role === "owner");
  
  const hasDeleteLeads = useHasPermission("delete_leads");
  const canDeleteLead = hasDeleteLeads|| role === "owner";
  const hasViewLeadsPermission = useHasPermission("view_leads");
 
  const canViewLead = hasViewLeadsPermission || role === "owner";


  

  const uniqueStatuses = [...new Set(leads.map(lead => lead.status))];
  const uniqueSources = [...new Set(leads.map(lead => lead.source))];
  const uniqueLocations = [...new Set(leads.map(lead => lead.location))];
  const uniqueAssignees = [...new Set(leads.map(lead => lead.employee?.name))].filter(Boolean);

  useEffect(() => {
    role === "owner" ? dispatch(fetchLeadsOwner()) : dispatch(fetchLeadsEmployee(userId),
    )
    setSelectedLeads([]);;
  }, [change]);

  const handleChnage = () => {
    setChange(!change);
    }
  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId) // Remove if already selected
        : [...prev, leadId] // Add if not selected
    );
  };
  
  const handleSelectAllChange = (event) => {
    setSelectedLeads(event.target.checked ? leads.map((lead) => lead.lead_id) : []);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'new': 'bg-blue-500',
      'contacted': 'bg-yellow-500',
      'Meeting Scheduled': 'bg-purple-500',
      'Qualified': 'bg-green-500',
      'Negotiation': 'bg-orange-500',
      'converted': 'bg-emerald-500',
      'Closed Lost': 'bg-red-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const handleNextPage = () => {
    if (next) {
      dispatch(fetchLeadsOwner(next));
      setSelectedLeads([]);
    }
  };

  const handlePrevPage = () => {
    if (previous) {
      dispatch(fetchLeadsOwner(previous));
      setSelectedLeads([]);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      source: '',
      assigned_to: '',
      location: ''
    });
  };

  const handleLeadOverView = (lead) => {
    navigate (`/dashboard/sale/leads/${lead.lead_id}/`);
    };

  
  

  const filteredLeads = leads.filter(lead => {

    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone_number.includes(search);
    

    const matchesStatus = !filters.status || lead.status === filters.status;
    

    const matchesSource = !filters.source || lead.source === filters.source;
    

    const matchesAssignee = !filters.assigned_to || lead.employee?.name === filters.assigned_to;
    

    const matchesLocation = !filters.location || lead.location === filters.location;
    
    return matchesSearch && matchesStatus && matchesSource && matchesAssignee && matchesLocation;
  });


  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <DashboardLayout>
      <div className=" min-h-screen font-sans">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
              <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">{leads.length}</span>
            </div>
            <div className="flex items-center space-x-3">
              {selectedLeads.length>0  && (
                <button className="bg-gray-300 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition p-5" onClick={()=>setStatus(prev=>!prev)}>
                <span className="flex items-center">
                  Status Update
                </span>
              </button>

              )}
              {status &&(
              <StatusDropdown
              type="lead"
              leads = {selectedLeads}

              />

            )}
              <button 
                className={`${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-3 py-2 rounded-md text-sm font-medium transition flex items-center`}
                onClick={toggleFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Sort
                </span>
              </button>
              {canAddLead && (
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                  + Add Lead
                </button>
              )}

              
            </div>
            
          </div>


          {showFilters && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4">

                <div className="w-56">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                {/* Assigned To Filter */}
                <div className="w-56">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.assigned_to}
                    onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
                  >
                    <option value="">All Assignees</option>
                    {uniqueAssignees.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Source Filter */}
                <div className="w-56">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                  >
                    <option value="">All Sources</option>
                    {uniqueSources.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location Filter */}
                <div className="w-56">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                {/* Clear Filters Button */}
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center px-6 py-3 bg-gray-50 border-t border-b border-gray-200">
            {canEditLead? (
              <ExactToolbar count={selectedLeads.length} leads={selectedLeads} onUpdate={handleChnage} onClose={() => setShowToolbar(false)}/>
            ) : (
              <>
                <div className="flex-1 flex space-x-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Search leads..." 
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Table */}
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                      onChange={handleSelectAllChange} 
                      checked={selectedLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.lead_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectedLeads?.includes(lead.lead_id)}
                        onChange={() => handleCheckboxChange(lead.lead_id)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={()=> handleLeadOverView(lead)}>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      </button>
                      
                    </td>
                    
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center space-x-3">
                          <img
                            src={userprofile}
                            alt="User"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {lead.employee?.name}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {lead.employee?.role?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimeAgo(lead.updated_at)}
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No leads match your current filters. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLeads.length}</span> of <span className="font-medium">{leads.length}</span> results
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button 
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 ${previous ? "text-blue-500" : "text-gray-300"}`}  
                    onClick={handlePrevPage}
                    disabled={!previous}
                  >
                    Previous
                  </button>
                  <button 
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 ${next ? "text-blue-500" : "text-gray-300"}`} 
                    onClick={handleNextPage}
                    disabled={!next}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MondayStyleLeadsTable;