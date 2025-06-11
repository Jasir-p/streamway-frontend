import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit3, Trash2, Calendar, DollarSign, Building2, User, SortAsc, SortDesc, Grid3X3, List, Download, RefreshCw, ChevronDown, X, CheckCircle, Clock, AlertCircle, XCircle, Tag } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { fetchDeals,updateDealsBulk } from '../../../../../redux/slice/DealSlice';
import { useSelector, useDispatch } from 'react-redux';
import AddDealModal from './DealForm';
import BulkEditModal from './BulkEditModal';
import DashbordLoading from '../../../../common/DashbordLoading';

const DealsListPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [change, setChange] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  
  const [filters, setFilters] = useState({
    stage: '', 
    status: '', 
    priority: '', 
    source: '', 
    assignedTo: '', 
    dateRange: '', 
    amountRange: ''
  });

  const dispatch = useDispatch();
  const { deals, loading, error, count } = useSelector((state) => state.deals);
  const role = useSelector((state) => state.auth.role);
  const userID = useSelector((state) => state.profile.id);
  const itemsPerPage = 10;
  const handleBulkUpdate = async (dealIds, updates) => {
  try {
    // Dispatch bulk update action
    await dispatch(updateDealsBulk({ dealIds, updates }));
    

    dispatch(fetchDeals(role, userID));
    

    setSelectedDeals([]);
    
    
    alert(`Successfully updated ${dealIds.length} deals`);
    
  } catch (error) {
    console.error('Bulk update failed:', error);
    throw error; // Re-throw so the modal can handle it
  }
};

  useEffect(() => {
    dispatch(fetchDeals(role, userID));
  }, [dispatch, change]);

  // Filter options based on your Django model choices
  const filterOptions = {
    stage: ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"],
    status: ["new", "in_progress", "won", "lost"],
    priority: ["high", "medium", "low"],
    source: [], // Add your source options here
    assignedTo: [], // This would need to be populated from your employees
    dateRange: ["This Week", "This Month", "Last 30 Days", "Last 90 Days"],
    amountRange: ["< ₹50K", "₹50K - ₹1L", "₹1L - ₹5L", "> ₹5L"]
  };

  // Utility functions
  const getStatusColor = (status) => ({
    "new": "bg-blue-100 text-blue-800",
    "in_progress": "bg-yellow-100 text-yellow-800", 
    "won": "bg-green-100 text-green-800",
    "lost": "bg-red-100 text-red-800"
  }[status] || "bg-gray-100 text-gray-800");

  const getStatusIcon = (status) => ({
    "new": <AlertCircle className="w-3 h-3" />,
    "in_progress": <Clock className="w-3 h-3" />,
    "won": <CheckCircle className="w-3 h-3" />,
    "lost": <XCircle className="w-3 h-3" />
  }[status] || <Clock className="w-3 h-3" />);

  const getPriorityColor = (priority) => ({
    "high": "bg-red-100 text-red-800 border-red-200",
    "medium": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "low": "bg-green-100 text-green-800 border-green-200"
  }[priority] || "bg-gray-100 text-gray-800 border-gray-200");

  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 100000) return `₹${(numAmount / 100000).toFixed(1)}L`;
    if (numAmount >= 1000) return `₹${(numAmount / 1000).toFixed(0)}K`;
    return `₹${numAmount}`;
  };

  const formatStage = (stage) => {
    return stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    if (!deals || deals.length === 0) return [];

    let filtered = deals.filter(deal => {
      const matchesSearch = [
        deal.title || '', 
        deal.account_id?.name || '', 
        deal.account_id?.assigned_to?.name || ''
      ].some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );


      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'amountRange') {
          const ranges = { 
            "< ₹50K": [0, 50000], 
            "₹50K - ₹1L": [50000, 100000], 
            "₹1L - ₹5L": [100000, 500000], 
            "> ₹5L": [500000, Infinity] 
          };
          const [min, max] = ranges[value] || [0, Infinity];
          const dealAmount = parseFloat(deal.amount);
          return dealAmount >= min && dealAmount < max;
        }
        if (key === 'assignedTo') {
          const assignedName = deal.account_id?.assigned_to?.name;
          return assignedName === value;
        }
        return deal[key] === value;
      });
      return matchesSearch && matchesFilters;
    });

    filtered.sort((a, b) => {
      const getValue = (deal) => {
        switch (sortBy) {
          case 'title': 
            return deal.title.toLowerCase();
          case 'amount': 
            return parseFloat(deal.amount);
          case 'expected_close_date': 
            return new Date(deal.expected_close_date);
          case 'created_at':
          default: 
            return new Date(deal.created_at);
        }
      };
      const [aVal, bVal] = [getValue(a), getValue(b)];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [deals, searchTerm, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeals = filteredDeals.slice(startIndex, startIndex + itemsPerPage);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setFilters({ stage: '', status: '', priority: '', source: '', assignedTo: '', dateRange: '', amountRange: '' });
    setSearchTerm('');
  };

  const toggleDealSelection = (dealId) => {
    setSelectedDeals(prev => prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]);
  };

  const selectAllDeals = () => {
    setSelectedDeals(selectedDeals.length === paginatedDeals.length ? [] : paginatedDeals.map(deal => deal.deal_id));
  };

  const FilterSelect = ({ value, onChange, options, placeholder }) => (
    <select value={value} onChange={onChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <option value="">{placeholder}</option>
      {options.map(option => <option key={option} value={option}>{formatStage(option)}</option>)}
    </select>
  );

  const ActionButton = ({ icon: Icon, color = "gray", onClick }) => (
    <button onClick={onClick} className={`p-1 text-gray-600 hover:text-${color}-600 hover:bg-${color}-50 rounded transition-colors`}>
      <Icon className="w-4 h-4" />
    </button>
  );

  const StatsCard = ({ icon: Icon, value, label, bgColor, iconColor }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );


  if (loading) {
    return (
     <DashbordLoading/>
    );
  }

  // // Show error state
  // if (error) {
  //   return (
  //     <DashboardLayout>
  //       <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
  //         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
  //           <div className="flex items-center gap-2">
  //             <XCircle className="w-5 h-5 text-red-600" />
  //             <span className="text-red-800 font-medium">Error loading deals</span>
  //           </div>
  //           <p className="text-red-700 mt-2">{error}</p>
  //           <button 
  //             onClick={() => dispatch(fetchDeals(role, userID))}
  //             className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
  //           >
  //             Try Again
  //           </button>
  //         </div>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
            <p className="text-gray-600">
              {filteredDeals.length} deals found
              {activeFiltersCount > 0 && ` (${activeFiltersCount} filters applied)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Deal
            </button>
            <ActionButton icon={Download} />
            <ActionButton 
              icon={RefreshCw} 
              onClick={() => dispatch(fetchDeals(role, userID))}
            />
          </div>
        </div>

        {isOpen && (
          <AddDealModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            role={role}
            userId={userID}
            onSuccess={() => setChange(!change)}
          />
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals, accounts, or assignees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
                <option value="amount">Amount</option>
                <option value="expected_close_date">Close Date</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>}
            </button>

            
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FilterSelect 
                  value={filters.stage} 
                  onChange={(e) => setFilters({...filters, stage: e.target.value})} 
                  options={filterOptions.stage} 
                  placeholder="All Stages" 
                />
                <FilterSelect 
                  value={filters.status} 
                  onChange={(e) => setFilters({...filters, status: e.target.value})} 
                  options={filterOptions.status} 
                  placeholder="All Status" 
                />
                <FilterSelect 
                  value={filters.priority} 
                  onChange={(e) => setFilters({...filters, priority: e.target.value})} 
                  options={filterOptions.priority} 
                  placeholder="All Priorities" 
                />
                <FilterSelect 
                  value={filters.amountRange} 
                  onChange={(e) => setFilters({...filters, amountRange: e.target.value})} 
                  options={filterOptions.amountRange} 
                  placeholder="All Amounts" 
                />
              </div>
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={clearFilters} 
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedDeals.length > 0 && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <span className="text-blue-700 font-medium">
        {selectedDeals.length} deal{selectedDeals.length > 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowBulkEditModal(true)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Bulk Edit
        </button>
        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Delete Selected
        </button>
        <button 
          onClick={() => setSelectedDeals([])} 
          className="p-1 text-blue-600 hover:text-blue-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
)}
        {/* Deals List/Grid */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedDeals.length === paginatedDeals.length && paginatedDeals.length > 0} 
                        onChange={selectAllDeals} 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                    </th>
                    {['Deal', 'Account', 'Stage', 'Status', 'Amount', 'Close Date', 'Assigned To', 'Actions'].map(header => (
                      <th key={header} className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${header === 'Actions' ? 'text-center' : ''}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedDeals.map((deal) => (
                    <tr key={deal.deal_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedDeals.includes(deal.deal_id)} 
                          onChange={() => toggleDealSelection(deal.deal_id)} 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{deal.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(deal.priority)}`}>
                            {formatPriority(deal.priority || 'medium')}
                          </span>
                          <span className="text-xs text-gray-500">ID: {deal.deal_id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {deal.account_id?.name || 'No Account'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {deal.account_id?.account_type || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-900">
                          {formatStage(deal.stage || 'discovery')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                          {getStatusIcon(deal.status)}
                          {formatStatus(deal.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatAmount(deal.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(deal.expected_close_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {deal.account_id?.assigned_to?.name 
                              ? `${deal.account_id?.assigned_to?.name}( ${deal.account_id?.assigned_to?.role.name})` 
                              : 'Owner'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <ActionButton icon={Eye} color="blue" />
                          <ActionButton icon={Edit3} color="green" />
                          <ActionButton icon={Trash2} color="red" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        
        )}

        {/* Empty State */}
        {filteredDeals.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || activeFiltersCount > 0 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first deal."}
            </p>
            {(searchTerm || activeFiltersCount > 0) ? (
              <button 
                onClick={clearFilters} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            ) : (
              <button 
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Deal
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredDeals.length > 0 && totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDeals.length)} of {filteredDeals.length} deals
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1} 
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                    return (
                      <button 
                        key={pageNum} 
                        onClick={() => setCurrentPage(pageNum)} 
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <StatsCard icon={Tag} value={filteredDeals.length} label="Total Deals" bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatsCard icon={DollarSign} value={formatAmount(filteredDeals.reduce((sum, deal) => sum + deal.amount, 0))} label="Total Value" bgColor="bg-green-100" iconColor="text-green-600" />
        <StatsCard icon={Clock} value={filteredDeals.filter(deal => deal.status === 'In Progress').length} label="In Progress" bgColor="bg-yellow-100" iconColor="text-yellow-600" />
        <StatsCard icon={CheckCircle} value={`${Math.round(filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length) || 0}%`} label="Avg. Probability" bgColor="bg-purple-100" iconColor="text-purple-600" />
      </div>
    </div>
    <BulkEditModal
  isOpen={showBulkEditModal}
  onClose={() => setShowBulkEditModal(false)}
  selectedDeals={selectedDeals}
  deals={deals}
  onBulkUpdate={handleBulkUpdate}
/>
    </DashboardLayout>
  );
};

export default DealsListPage;