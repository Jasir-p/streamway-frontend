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

const CRMAdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');


  // Menu items for the sidebar with Lucide icons
  const menuItems = [
    { id: 'dashboard', icon: BarChart4, label: 'Dashboard' },
    { id: 'tenants', icon: Building2, label: 'Tenant Management' },
    { id: 'billing', icon: CreditCard, label: 'Billing & Subscriptions' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'roles', icon: Key, label: 'Roles & Permissions' },
    { id: 'workflows', icon: Layers, label: 'Workflow Settings' },
    { id: 'integrations', icon: Plug, label: 'Integrations' },
    { id: 'reports', icon: LineChart, label: 'Reports & Analytics' },
    { id: 'settings', icon: Settings, label: 'System Settings' },
    { id: 'audit', icon: Clipboard, label: 'Audit Logs' },
  ];

  // Render content based on active menu
  const renderContent = () => {
    switch(activeMenu) {
      case 'tenants':
        return renderTenants();
      case 'billing':
        return renderBilling();
      default:
        return renderDashboard();
    }
  };

  // Dashboard content
  const renderDashboard = () => (
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
  );

  // Tenant Management content
  const renderTenants = () => (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Tenant Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Tenant</button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Acme Corporation</td>
              <td className="px-6 py-4 whitespace-nowrap">45</td>
              <td className="px-6 py-4 whitespace-nowrap">Enterprise</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Edit | Manage | Delete</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Tech Solutions Inc</td>
              <td className="px-6 py-4 whitespace-nowrap">28</td>
              <td className="px-6 py-4 whitespace-nowrap">Professional</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Edit | Manage | Delete</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Global Enterprises</td>
              <td className="px-6 py-4 whitespace-nowrap">112</td>
              <td className="px-6 py-4 whitespace-nowrap">Enterprise</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Edit | Manage | Delete</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Digital Services Co</td>
              <td className="px-6 py-4 whitespace-nowrap">17</td>
              <td className="px-6 py-4 whitespace-nowrap">Standard</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Trial</span></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Edit | Manage | Delete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Billing & Subscriptions content
  const renderBilling = () => (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Billing & Subscriptions</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Plan</button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700 mb-2">Subscription Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-bold">Standard</h4>
            <p className="text-2xl font-bold mt-2">$29<span className="text-sm text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">Up to 10 users</li>
              <li className="text-sm">Basic features</li>
              <li className="text-sm">Email support</li>
            </ul>
            <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded">Edit</button>
          </div>
          <div className="border rounded-lg p-4 border-blue-500">
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded absolute -mt-6">POPULAR</div>
            <h4 className="font-bold">Professional</h4>
            <p className="text-2xl font-bold mt-2">$79<span className="text-sm text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">Up to 50 users</li>
              <li className="text-sm">Advanced features</li>
              <li className="text-sm">Priority support</li>
            </ul>
            <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded">Edit</button>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-bold">Enterprise</h4>
            <p className="text-2xl font-bold mt-2">$199<span className="text-sm text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">Unlimited users</li>
              <li className="text-sm">All features</li>
              <li className="text-sm">24/7 support</li>
            </ul>
            <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded">Edit</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold text-gray-700 mb-2">Recent Invoices</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">INV-2025-001</td>
              <td className="px-6 py-4 whitespace-nowrap">Acme Corporation</td>
              <td className="px-6 py-4 whitespace-nowrap">$199.00</td>
              <td className="px-6 py-4 whitespace-nowrap">03/15/2025</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">INV-2025-002</td>
              <td className="px-6 py-4 whitespace-nowrap">Tech Solutions Inc</td>
              <td className="px-6 py-4 whitespace-nowrap">$79.00</td>
              <td className="px-6 py-4 whitespace-nowrap">03/14/2025</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">INV-2025-003</td>
              <td className="px-6 py-4 whitespace-nowrap">Global Enterprises</td>
              <td className="px-6 py-4 whitespace-nowrap">$199.00</td>
              <td className="px-6 py-4 whitespace-nowrap">03/12/2025</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
     
      <SidebarAdmin/>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100">
                <Settings size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span>AD</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CRMAdminDashboard;