import React, { useEffect, useState } from 'react';
import { 
  BarChart4, 
  Building2, 
  CreditCard, 
  Users, 
  Key, 
  Settings, 
  Plug, 
  LineChart, 
  Clipboard, 
  Layers
} from 'lucide-react';

import { useSelector,useDispatch } from 'react-redux';
import { fetchallTenants } from '../../../redux/slice/projectadmin/CompanySlice';
import SidebarAdmin from './SidebarAdmin';
import Layout from './Layout';

const CRMAdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <Layout>
        <main className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700">Total Tenants</h3>
        <p className="text-2xl font-bold mt-2">42</p>
        <p className="text-green-500 text-sm">↑ 12% from last month</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700">Active Subscriptions</h3>
        <p className="text-2xl font-bold mt-2">38</p>
        <p className="text-green-500 text-sm">↑ 8% from last month</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700">Monthly Revenue</h3>
        <p className="text-2xl font-bold mt-2">$24,850</p>
        <p className="text-green-500 text-sm">↑ 15% from last month</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow col-span-2">
        <h3 className="font-bold text-gray-700">Recent Activities</h3>
        <ul className="mt-2 space-y-2">
          <li className="text-sm p-2 bg-gray-50 rounded">New tenant "Acme Corp" created</li>
          <li className="text-sm p-2 bg-gray-50 rounded">Plan upgrade for "Tech Solutions Inc"</li>
          <li className="text-sm p-2 bg-gray-50 rounded">New user added to "Global Enterprises"</li>
          <li className="text-sm p-2 bg-gray-50 rounded">Payment received from "Digital Services Co"</li>
        </ul>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700">System Status</h3>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Server Uptime</span>
            <span className="text-green-500 text-sm">99.9%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">API Status</span>
            <span className="text-green-500 text-sm">Operational</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Database</span>
            <span className="text-green-500 text-sm">Healthy</span>
          </div>
        </div>
      </div>
    </div>
        </main>
      </Layout>
    
  );
};

export default CRMAdminDashboard;