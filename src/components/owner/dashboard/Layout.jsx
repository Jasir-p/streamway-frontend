import React from 'react'
import SidebarAdmin from './SidebarAdmin'
import { useLocation } from 'react-router-dom';
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


const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'tenants', label: 'Tenant Management', path: '/admin/tenants' },
    { id: 'billing', label: 'Billing & Subscriptions', path: '/admin/billings' },
    { id: 'users', label: 'User Management', path: '/admin/users' },
    { id: 'roles', label: 'Roles & Permissions', path: '/admin/roles' },
    { id: 'workflows', label: 'Workflow Settings', path: '/admin/workflows' },
    { id: 'integrations', label: 'Integrations', path: '/admin/integrations' },
    { id: 'reports', label: 'Reports & Analytics', path: '/admin/reports' },
    { id: 'settings', label: 'System Settings', path: '/admin/settings' },
    { id: 'audit', label: 'Audit Logs', path: '/admin/audit' },
  ];
const Layout = ({children}) => {
    const location = useLocation()
    const activeMenuItem = menuItems.find((item) =>
        location.pathname.startsWith(item.path)
      );

  return (
    <div>
      
      <div className="flex h-screen bg-gray-100">
     
      <SidebarAdmin/>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeMenuItem)?.label || 'Dashboard'}
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
          {children}
        </main>
      </div>
    </div>
    </div>
  )
}

export default Layout
