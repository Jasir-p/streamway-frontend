import React, { useEffect, useState } from 'react';
import {
  Building2,
  CreditCard,
  Users,
  AlertTriangle,
  Clipboard,
  FileText,
  Award,
} from 'lucide-react';

import Layout from './Layout';
import defaultInterceptor from '../../../Intreceptors/defaultInterceptors';

const CRMAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await defaultInterceptor.get("/api/admin-dashboard/");
      setDashboardData(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading Dashboard...</div>;
  }
  const totalPaidRevenue = dashboardData?.invoices
  .filter((inv) => inv.status === 'paid')
  .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

   const overDueInvoices = dashboardData?.invoices
  .filter((inv) => inv.status === 'Pending')
 

  return (
    <Layout>
      <main className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Tenants */}
          <DashboardCard
            title="Total Tenants"
            value={dashboardData?.tenants_count || 0}
            trend="↑ 12% from last month"
            icon={<Building2 className="w-8 h-8 text-blue-500" />}
          />

          {/* Invoices Generated */}
          <DashboardCard
            title="Invoices Generated"
            value={dashboardData?.invoices.length || 0}
            trend="↑ 10% from last month"
            icon={<FileText className="w-8 h-8 text-purple-500" />}
          />

          {/* Total Revenue */}
          <DashboardCard
            title="Total Revenue"
            value={`$${totalPaidRevenue.toFixed(2).toLocaleString() || '0'}`}
            trend="↑ 15% from last month"
            icon={<CreditCard className="w-8 h-8 text-green-500" />}
          />

          {/* Overdue Invoices */}
          <DashboardCard
            title="Overdue Invoices"
            value={dashboardData?.overDueInvoices || 0}
            trend="↑ Needs attention"
            icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
          />

          {/* Recent Invoices */}
          <div className="bg-white p-4 rounded-lg shadow col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Clipboard className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-gray-700">Recent Invoices</h3>
            </div>
            <ul className="mt-2 space-y-2">
              {dashboardData?.recent_invoices?.map((invoice, index) => (
                <li key={index} className="text-sm p-2 bg-gray-50 rounded flex justify-between items-center">
                  <span>{`Invoice #${invoice.invoice_no} - ${invoice.tenant}`}</span>
                  <span className="font-semibold text-green-600">₹{invoice.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Paying Tenants */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-gray-700">Top Paying Tenants</h3>
            </div>
            <ul className="mt-2 space-y-2">
              {dashboardData?.top_paying_tenants?.map((tenant, index) => (
                <li
                  key={index}
                  className="text-sm flex justify-between items-center p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded"
                >
                  <span className="font-medium">{tenant.tenant}</span>
                  <span className="font-bold text-orange-600">₹{tenant.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Subscriptions */}
          <DashboardCard
            title="Active Subscriptions"
            value={dashboardData?.active_subscriptions || 0}
            trend="↑ 8% from last month"
            icon={<Users className="w-8 h-8 text-indigo-500" />}
          />
        </div>
      </main>
    </Layout>
  );
};

// Reusable card component
const DashboardCard = ({ title, value, trend, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className="text-green-500 text-sm">{trend}</p>
      </div>
      {icon}
    </div>
  </div>
);

export default CRMAdminDashboard;
