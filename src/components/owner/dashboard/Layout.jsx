import React, { useState, useRef, useEffect } from 'react'
import SidebarAdmin from './SidebarAdmin'
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Settings, 
    User,
    LogOut,
    ChevronDown
  } from 'lucide-react';

import { adminLogout } from '../../tenant/authentication/Authentication';

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

const Layout = ({ children }) => {
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    const activeMenuItem = menuItems.find((item) =>
        location.pathname.startsWith(item.path)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserMenuToggle = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogout = async () => {
        try {
            setShowUserMenu(false);
            await adminLogout(navigate);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfile = () => {
        console.log('Navigate to profile...');
        setShowUserMenu(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <SidebarAdmin />

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeMenuItem?.label || 'Dashboard'}
                        </h1>
                        
                        <div className="flex items-center space-x-4">
                            {/* Settings Button */}
                            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                <Settings size={20} />
                            </button>
                            
                            {/* User Menu Dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button 
                                    onClick={handleUserMenuToggle}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                        <span>AD</span>
                                    </div>
                                    <ChevronDown 
                                        size={16} 
                                        className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                                            <p className="text-xs text-gray-500">admin@example.com</p>
                                        </div>
                                        
                                        <button
                                            onClick={handleProfile}
                                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <User size={16} className="mr-3" />
                                            Profile
                                        </button>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} className="mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;