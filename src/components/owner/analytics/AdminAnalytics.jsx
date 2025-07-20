import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { DollarSign, Users, Building2, TrendingUp, Award, Clock, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './components/StatusBadge';
import { MetricCard } from './components/MetricsCard';
import Layout from '../dashboard/Layout';
import { useSelector,useDispatch } from 'react-redux';
import { fetchallTenants } from '../../../redux/slice/projectadmin/CompanySlice';
import useAnalytics from './hooks/useAnalyst';
import { FilterSection } from './components/FilterSction';


const TenantAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [filters, setFilters] = useState({
      type: 'month',
      startDate: '',
      endDate: ''
    });
  const {tenants}= useSelector((state)=>state.tenants)
  const {tenantPayments,globalStats,monthlyData, loading}= useAnalytics(filters)
  const dispatch = useDispatch()
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = (appliedFilters) => {
    console.log('Applying filters:', appliedFilters);
    // This will trigger the useAnalytics hook to refetch data
  };


  useEffect(()=>{
    dispatch(fetchallTenants())
  },[])
  




  // Monthly revenue data for charts


  // Calculate metrics
  const totalRevenue = globalStats?.total_paid;
  const activeTenants = tenants.length;
  const totalEmployees = tenants.reduce((sum, tenant) => sum + tenant?.user_count, 0);
  const avgPayment = Math.round(totalRevenue / activeTenants);
  const avgEmployees = Math.round(totalEmployees / activeTenants);

  // Prepare chart data
  const topTenantsChart = tenantPayments.slice(0, 6).map(tenant => ({
    name: tenant.tenant_name.split(' ')[0],
    payment: tenant.total_paid,
    employees: tenant.employees
  }));

  const industryData = tenantPayments.reduce((acc, tenant) => {
    acc[tenant.industry] = (acc[tenant.industry] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(industryData).map(([industry, count]) => ({
    name: industry,
    value: count
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  // Metric Card Component



  
  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
             Analytics 
              </h1>
              <p className="text-gray-600 text-lg">Real-time insights into tenant payments and performance</p>
            </div>
            
          </div>
        </div>
        <FilterSection 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
          />
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-gradient-to-r from-green-500 to-emerald-600"

          />
     
          <MetricCard
            title="Avg Payment"
            value={`$${avgPayment.toLocaleString()}`}
            icon={TrendingUp}
            color="bg-gradient-to-r from-orange-500 to-red-500"

          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Revenue Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Tenants by Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Top Tenants by Payment
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTenantsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="payment" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Paying Tenants Table */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Top Paying Tenants
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Tenant Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Last Bill Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Employees</th>
                  
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Last Bill Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Totel Paid</th>
                </tr>
              </thead>
              <tbody>
                {tenantPayments?.map((tenant, index) => (
                  <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{tenant.tenant_name}</div>
                      <div className="text-sm text-gray-500">ID: {tenant.tenant_id}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">${tenant?.monthly_payment?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{tenant.employees}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <StatusBadge status={tenant.last_paid_status} paymentDate={tenant?.billing_due} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${tenant.growth > 10 ? 'text-green-600' : tenant.growth > 5 ? 'text-blue-600' : 'text-gray-600'}`}>
                        ${tenant.total_paid}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Status Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Payment Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">On Time</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                    <div className="h-2 bg-green-500 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Due Soon</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <span className="font-semibold text-gray-900">10%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                    <div className="h-2 bg-red-500 rounded-full" style={{width: '5%'}}></div>
                  </div>
                  <span className="font-semibold text-gray-900">5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Insights */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Revenue Insights
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600"> Current Month </span>
                <span className="font-semibold text-gray-900">${globalStats.this_month_paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Month</span>
                <span className="font-semibold text-green-600">${globalStats.last_month_paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="font-semibold text-orange-600">${globalStats.due_amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '95.4%'}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">95.4% of monthly target achieved</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-purple-600" />
              Quick Stats(all)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Active  Tenants</span>
                <span className="font-semibold text-gray-900">{activeTenants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Employees</span>
                <span className="font-semibold text-gray-900">{totalEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Employees/Tenant</span>
                <span className="font-semibold text-gray-900">{avgEmployees}</span>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default TenantAnalytics;