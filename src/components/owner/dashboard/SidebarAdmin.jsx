import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const SidebarAdmin = () => {
  const location = useLocation();
  const menuItems = [
    { id: 'dashboard', icon: BarChart4, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'tenants', icon: Building2, label: 'Tenant Management', path: '/admin/tenants' },
    { id: 'billing', icon: CreditCard, label: 'Billing & Subscriptions', path: '/admin/billing' },
    { id: 'users', icon: Users, label: 'User Management', path: '/admin/users' },
    { id: 'roles', icon: Key, label: 'Roles & Permissions', path: '/admin/roles' },
    { id: 'workflows', icon: Layers, label: 'Workflow Settings', path: '/admin/workflows' },
    { id: 'integrations', icon: Plug, label: 'Integrations', path: '/admin/integrations' },
    { id: 'reports', icon: LineChart, label: 'Reports & Analytics', path: '/admin/reports' },
    { id: 'settings', icon: Settings, label: 'System Settings', path: '/admin/settings' },
    { id: 'audit', icon: Clipboard, label: 'Audit Logs', path: '/admin/audit' },
  ];

  return (
    <div className="sticky w-64 bg-gray-800 text-white h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">CRM Admin</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link to={item.path}>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${
                    location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
