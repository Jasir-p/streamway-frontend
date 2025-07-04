import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { Link } from 'react-router-dom';
import DashbordLoading from '../../../../common/DashbordLoading';

// Custom Hooks
import { useSalesPipeline } from './hooks/useSalesPipeline';
import { useDateFilter } from './hooks/useDateFilter';
import { useMetrics } from './hooks/useMetrics';

// Components
import PipelineCard from './components/PipelineCard';
import MetricsCard from './components/MetricsCard';
import FilterSection from './components/FilterSection';
import PipelineTabs from './components/PipelineTabs';
import StageSummary from './components/StageSummary';

// API & Data
import { leadStages, dealStages } from './api/mockData';

const SalesPipelineDashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const subdomain = localStorage.getItem('subdomain')

  const {
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
  } = useDateFilter();

  const {
    leads,
    deals,
    latest_leads,
    latest_deals,
    loading,
    error,
    retryFetch,
  } = useSalesPipeline(dateFilter, customDateRange);

  const { calculateMetrics } = useMetrics();

  const setData = activeTab === 'leads' ? latest_leads : latest_deals;
  const currentData = activeTab === 'leads' ? leads : deals;
  const metrics = calculateMetrics(currentData, activeTab === 'deals');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);

  // ✅ Make sure all hooks are ABOVE any early returns

  if (loading) {
    return <DashbordLoading />;
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading pipeline data: {error}</p>
            <button
              onClick={retryFetch}
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
            </div>
            <PipelineTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Filters */}
          <FilterSection
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricsCard
              title={`Total ${activeTab === 'leads' ? 'Leads' : 'Deals'}`}
              value={metrics.total}
              icon={activeTab === 'leads' ? Users : DollarSign}
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />

            {activeTab === 'deals' ? (
              <>
                <MetricsCard
                  title="Total Value"
                  value={formatCurrency(metrics.totalValue)}
                  icon={TrendingUp}
                  bgColor="bg-green-100"
                  iconColor="text-green-600"
                />
                <MetricsCard
                  title="Average Value"
                  value={formatCurrency(metrics.avgValue)}
                  icon={DollarSign}
                  bgColor="bg-yellow-100"
                  iconColor="text-yellow-600"
                />
                <MetricsCard
                  title="Win Rate"
                  value={`${metrics.winRate?.toFixed(1)}%`}
                  icon={TrendingUp}
                  bgColor="bg-purple-100"
                  iconColor="text-purple-600"
                />
              </>
            ) : (
              <>
                <MetricsCard
                  title="Converted"
                  value={metrics.convertedLeads}
                  icon={TrendingUp}
                  bgColor="bg-green-100"
                  iconColor="text-green-600"
                />
                <MetricsCard
                  title="Conversion Rate"
                  value={`${metrics.conversionRate?.toFixed(1)}%`}
                  icon={TrendingUp}
                  bgColor="bg-yellow-100"
                  iconColor="text-yellow-600"
                />
                <MetricsCard
                  title="Contact Rate"
                  value={`${metrics.contactRate?.toFixed(1)}%`}
                  icon={Users}
                  bgColor="bg-purple-100"
                  iconColor="text-purple-600"
                />
              </>
            )}
          </div>

          {/* Pipeline Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'leads' ? 'Recent Leads ' : 'Recent Deals'}
              </h2>

              <Link
                to={
                  activeTab === 'leads'
                    ? `/${subdomain}/dashboard/sale/leads`
                    : `/${subdomain}/dashboard/sale/deals`
                }
                className="text-sm text-blue-600 hover:underline"
              >
                View All {activeTab === 'leads' ? 'Leads' : 'Deals'}
              </Link>
            </div>

            <div className="p-6">
              {setData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {setData.map((item) => (
                    <PipelineCard
                      key={item.id || item.lead_id}
                      item={item}
                      isDeals={activeTab === 'deals'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No {activeTab} found for the selected filters.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stage Summary */}
          <StageSummary
            activeTab={activeTab}
            currentData={currentData}
            leadStages={leadStages}
            dealStages={dealStages}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesPipelineDashboard;
