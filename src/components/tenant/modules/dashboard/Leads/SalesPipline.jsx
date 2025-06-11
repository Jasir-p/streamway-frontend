import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Filter, TrendingUp, Users, DollarSign, Clock, ChevronDown, MoreVertical } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeadsEmployee, fetchLeadsOwner } from '../../../../../redux/slice/leadsSlice';
import { useNavigate } from 'react-router-dom';

const SalesPipelineDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  const [dateFilter, setDateFilter] = useState('all');
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.profile.id);
  const { leads, loading, error, next, previous } = useSelector((state) => state.leads);

  useEffect(() => {
    if (role === "owner") {
      dispatch(fetchLeadsOwner());
    } else {
      dispatch(fetchLeadsEmployee(userId));
    }
  }, [dispatch, role, userId]);

  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const isDateInRange = (emailDate, filter) => {
    const today = new Date();
    const emailDateObj = new Date(emailDate);
    
    switch(filter) {
      case 'today':
        return emailDateObj.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return emailDateObj >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return emailDateObj >= monthAgo;
      case 'last-month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return emailDateObj >= lastMonthStart && emailDateObj <= lastMonthEnd;
      case 'custom':
        if (!customDateRange.startDate || !customDateRange.endDate) return true;
        const startDate = new Date(customDateRange.startDate);
        const endDate = new Date(customDateRange.endDate);
        return emailDateObj >= startDate && emailDateObj <= endDate;
      default:
        return true;
    }
  };

  // Enhanced filtering logic
  const filteredLeads = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];
    
    return leads.filter(lead => {
      const dateMatch = dateFilter === 'all' || isDateInRange(lead?.created_at, dateFilter);
      return dateMatch;
    });
  }, [leads, dateFilter, customDateRange]);

  // Sample data for deals
  const dealData = [
    { id: 1, name: 'Enterprise Software License', company: 'Global Tech', value: 45000, status: 'Proposal', probability: 75, closeDate: '2024-06-15', owner: 'Alex Thompson' },
    { id: 2, name: 'Marketing Automation Setup', company: 'StartupXYZ', value: 25000, status: 'Negotiation', probability: 85, closeDate: '2024-06-20', owner: 'Lisa Chen' },
    { id: 3, name: 'Consulting Services', company: 'MegaCorp', value: 18000, status: 'Discovery', probability: 40, closeDate: '2024-06-25', owner: 'James Wilson' },
    { id: 4, name: 'Cloud Migration', company: 'FinanceFirst', value: 35000, status: 'Proposal', probability: 60, closeDate: '2024-06-30', owner: 'Maria Garcia' },
    { id: 5, name: 'Training Package', company: 'EduTech', value: 12000, status: 'Closed Won', probability: 100, closeDate: '2024-06-01', owner: 'Alex Thompson' }
  ];

   const filteredDeal = useMemo(() => {
    if (!dealData || !Array.isArray(dealData)) return [];
    
    return dealData.filter(deal => {
      const dateMatch = dateFilter === 'all' || isDateInRange(deal?.closeDate, dateFilter);
      return dateMatch;
    });
  }, [leads, dateFilter, customDateRange]);

  const leadStages = ['new', 'contacted', 'follow_up', 'negotiation', 'converted', 'lost'];
  const dealStages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const getStageColor = (stage) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'follow_up': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'converted': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800',
      'Discovery': 'bg-purple-100 text-purple-800',
      'Proposal': 'bg-yellow-100 text-yellow-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Closed Won': 'bg-green-100 text-green-800',
      'Closed Lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateMetrics = (data, isDeals = false) => {
    const total = data.length;
    
    if (isDeals) {
      const totalValue = data.reduce((sum, item) => sum + item.value, 0);
      const avgValue = total > 0 ? totalValue / total : 0;
      const wonDeals = data.filter(deal => deal.status === 'Closed Won').length;
      const winRate = total > 0 ? (wonDeals / total) * 100 : 0;
      return { total, totalValue, avgValue, winRate };
    }
    
    // For leads - no value calculations
    const convertedLeads = data.filter(lead => lead.status === 'converted').length;
    const conversionRate = total > 0 ? (convertedLeads / total) * 100 : 0;
    const contactedLeads = data.filter(lead => lead.status !== 'new').length;
    const contactRate = total > 0 ? (contactedLeads / total) * 100 : 0;
    
    return { total, conversionRate, contactRate, convertedLeads };
  };

  const currentData = activeTab === 'leads' ? filteredLeads : filteredDeal;
  const metrics = calculateMetrics(currentData, activeTab === 'deals');

  const PipelineCard = ({ item, isDeals = false }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
          {isDeals ? (
            <p className="text-sm text-gray-600">{item.company}</p>
          ) : (
            <p className="text-sm text-gray-600">{item.email}</p>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        {isDeals ? (
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(item.value)}
          </span>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">📍 {item.location}</span>
          </div>
        )}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(item.status)}`}>
          {item.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        {isDeals ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Probability:</span>
              <span className="font-medium">{item.probability}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Close Date:</span>
              <span className="font-medium">{new Date(item.closeDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Owner:</span>
              <span className="font-medium">{item.owner}</span>
            </div>
          </>
        ) : (
          <div 
            onClick={() => navigate(`/dashboard/sale/leads/${item.lead_id}/`)}
            className="cursor-pointer hover:bg-gray-50 p-2 rounded"
          >  
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{item.phone_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Source:</span>
              <span className="font-medium">{item.source}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Assigned to:</span>
              <span className="font-medium">{item.employee ? item.employee?.name : "Not assigned"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading leads: {error}</p>
            <button 
              onClick={() => role === "owner" ? dispatch(fetchLeadsOwner()) : dispatch(fetchLeadsEmployee(userId))}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
              <div className="flex items-center space-x-3">
                {/* Add any header actions here */}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'leads'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Lead Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'deals'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Deal Pipeline
                </button>
              </nav>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['all', 'today', 'week', 'month', 'last-month', 'custom'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      dateFilter === filter
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'last-month' ? 'Last Month' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {dateFilter === 'custom' && (
                <div className="flex items-center space-x-2 ml-4">
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => setCustomDateRange(prev => ({...prev, startDate: e.target.value}))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => setCustomDateRange(prev => ({...prev, endDate: e.target.value}))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total {activeTab === 'leads' ? 'Leads' : 'Deals'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  {activeTab === 'leads' ? <Users className="w-6 h-6 text-blue-600" /> : <DollarSign className="w-6 h-6 text-blue-600" />}
                </div>
              </div>
            </div>

            {activeTab === 'deals' ? (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgValue)}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Win Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.winRate?.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Converted</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.convertedLeads}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate?.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.contactRate?.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pipeline Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'leads' ? 'Lead Pipeline' : 'Deal Pipeline'}
              </h2>
            </div>
            
            <div className="p-6">
              {currentData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentData.map((item) => (
                    <PipelineCard key={item.id || item.lead_id} item={item} isDeals={activeTab === 'deals'} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No {activeTab} found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stage Summary */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(activeTab === 'leads' ? leadStages : dealStages).map((status) => {
                const stageItems = currentData.filter(item => item.status === status);
                const stageValue = activeTab === 'deals' ? stageItems.reduce((sum, item) => sum + item.value, 0) : 0;
                
                return (
                  <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {status.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xl font-bold text-gray-900">{stageItems.length}</p>
                    {activeTab === 'deals' && (
                      <p className="text-sm text-gray-500">{formatCurrency(stageValue)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesPipelineDashboard;