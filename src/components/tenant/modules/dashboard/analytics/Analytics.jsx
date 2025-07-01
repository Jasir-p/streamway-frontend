import React, { useState, useEffect } from 'react';
import { 
  Users, Target, TrendingUp, Calendar, CheckCircle, Clock, 
  DollarSign, Phone, Mail, Award, Filter, Download, CalendarDays, X
} from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { KPACard } from './components/card/KPACard';
import { TeamsKPA } from './components/sections/TeamsKPA';
import { AdminKPA } from './components/sections/AdminKPA';
import { EmployeesKPA } from './components/sections/EmployeesKPA';
import { useAnalytics } from './hooks/useAnalytics';
import { useAnalysePermissions } from '../../../authorization/useAnalysePermissions';

export const getMockData = (filters, activeTab) => {


  const revenueData = [
    { month: 'Jan', revenue: 45000, deals: 8 },
    { month: 'Feb', revenue: 52000, deals: 12 },
    { month: 'Mar', revenue: 48000, deals: 10 },
    { month: 'Apr', revenue: 65000, deals: 15 },
    { month: 'May', revenue: 58000, deals: 13 },
    { month: 'Jun', revenue: 72000, deals: 18 }
  ];

  return {
    revenueData
  };
};

// Enhanced Filter Component
const FilterSection = ({ filters, onFiltersChange, onApplyFilters }) => {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleFilterTypeChange = (type) => {
    setTempFilters(prev => ({ ...prev, type }));
    if (type === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      // Auto-apply for predefined filters
      const newFilters = { ...tempFilters, type };
      onFiltersChange(newFilters);
      onApplyFilters(newFilters);
    }
  };

  const handleCustomDateChange = (field, value) => {
    setTempFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomFilters = () => {
    if (tempFilters.startDate && tempFilters.endDate) {
      onFiltersChange(tempFilters);
      onApplyFilters(tempFilters);
      setShowCustomDateRange(false);
    }
  };

  const clearCustomDates = () => {
    setTempFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
    setShowCustomDateRange(false);
  };

  const filterOptions = [
    { value: 'all', label: 'All Time', icon: '📊' },
    { value: 'month', label: 'This Month', icon: '📅' },
    { value: 'last_month', label: 'Last Month', icon: '📆' },
    { value: 'year', label: 'This Year', icon: '🗓️' },
    { value: 'custom', label: 'Custom Range', icon: '🎯' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Filter Options */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterTypeChange(option.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-all duration-200 ${
                tempFilters.type === option.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {showCustomDateRange && (
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempFilters.startDate || ''}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempFilters.endDate || ''}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={applyCustomFilters}
                  disabled={!tempFilters.startDate || !tempFilters.endDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearCustomDates}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Display */}
        {filters.type && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Active Filter: {filterOptions.find(opt => opt.value === filters.type)?.label}
                {filters.type === 'custom' && filters.startDate && filters.endDate && (
                  <span className="ml-2">
                    ({filters.startDate} to {filters.endDate})
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CRMAnalytics = () => {
  const { canViewAll, canViewEmployees, canViewTeam } = useAnalysePermissions();
  
  // Function to get the default tab based on permissions
  const getDefaultTab = () => {
    if (canViewTeam) return 'teams';
    if (canViewEmployees) return 'employees';
    if (canViewAll) return 'admin';
    return null; // No permissions
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [filters, setFilters] = useState({
    type: 'month',
    startDate: '',
    endDate: ''
  });

  // Update activeTab when permissions change
  useEffect(() => {
    const defaultTab = getDefaultTab();
    if (defaultTab && !activeTab) {
      setActiveTab(defaultTab);
    }
  }, [canViewAll, canViewEmployees, canViewTeam, activeTab]);

  // Use the analytics hook only if we have a valid tab
  const { data, loading, error } = useAnalytics(filters, activeTab);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = (appliedFilters) => {
    console.log('Applying filters:', appliedFilters);
    // This will trigger the useAnalytics hook to refetch data
  };

  const exportData = () => {
    // Export functionality
    console.log('Exporting data with filters:', filters);
  };

  // Check if user has any permissions
  const hasAnyPermission = canViewAll || canViewEmployees || canViewTeam;

  // No permissions - show access denied
  if (!hasAnyPermission) {
    return (
      <DashboardLayout>
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view analytics data.</p>
            <p className="text-gray-500 text-sm mt-2">Please contact your administrator for access.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Data</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stream Way CRM Analytics</h1>
                <p className="text-gray-600 mt-1">Track performance across teams, employees, and business metrics</p>
              </div>
              {activeTab && (
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <button 
                    onClick={exportData}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Filter Section - Only show if user has valid tab */}
          {activeTab && (
            <FilterSection 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
            />
          )}

          {/* Navigation Tabs - Only show if user has permissions */}
          {activeTab && (
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {canViewTeam && (
                    <button
                      onClick={() => setActiveTab('teams')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'teams'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      🟩 Teams KPA
                    </button>
                  )}
                  {canViewEmployees && (
                    <button
                      onClick={() => setActiveTab('employees')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'employees'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      🟨 Employees KPA
                    </button>
                  )}
                  {canViewAll && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'admin'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      🟦 Overall KPA Performance Summary
                    </button>
                  )}
                </nav>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && activeTab && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading analytics data...</span>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && activeTab && (
            <div>
              {activeTab === 'teams' && (
                <TeamsKPA 
                  teamTaskData={data.teamTaskData} 
                  taskStatusData={data.taskStatusData}
                />
              )}
              {activeTab === 'employees' && (
                <EmployeesKPA 
                  employeeData={data.employeeData} 
                  radarData={data.radarData} 
                />
              )}
              {activeTab === 'admin' && (
                <AdminKPA 
                  tenantData={data.tenantData} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CRMAnalytics;