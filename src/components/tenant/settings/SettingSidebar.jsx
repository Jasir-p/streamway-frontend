import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowLeft, Settings, Users, Shield, CreditCard, BarChart2 } from 'lucide-react';

function SettingSidebar() {
  const [isActive, setActive] = useState('general');
  const subdomain = localStorage.getItem("subdomain") || "";

  const handleClick = (text) => {
    setActive(text);
  };

  const menuItems = [
    { id: 'general', icon: Settings, label: 'General', path: "/setting/genaral" },
    { id: 'users', icon: Users, label: 'Users', path: "/setting/users" },
    { id: 'security', icon: Shield, label: 'Security', path: '/setting/security' },
    { id: 'billing', icon: CreditCard, label: 'Billing', path: "/setting/payment" },
    // { id: 'usage', icon: BarChart2, label: 'Usage Stats', path: "" },
    { id: 'lead_form', icon: LayoutGrid, label: 'Lead Form', path: "/setting/lead_form" },
  ];

  const sections = [
    { title: 'General', items: menuItems.slice(0, 3) },
    { title: 'Account', items: menuItems.slice(3, 4) },
    { title: 'Management', items: menuItems.slice(4) }
  ];

  return (
    <div className="sticky h-screen w-64 bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-700 flex flex-col shadow-lg">
      <div className="p-4 border-b border-blue-600/30">
        <h1 className="text-lg font-semibold text-white flex items-center">
          <Settings className="h-5 w-5 mr-2 text-yellow-400" />
          Settings
        </h1>
      </div>

      {/* Dashboard Button */}
      <div className="p-3 border-b border-blue-600/30">
        <Link
          to={`/${subdomain}/dashboard`}
          className="flex items-center px-3 py-2 text-sm rounded-md transition-all duration-150 text-blue-100 hover:bg-white/10 hover:text-white group"
        >
          <ArrowLeft className="h-4 w-4 mr-3 text-blue-200 group-hover:text-yellow-400 transition-colors duration-150" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="space-y-4 p-3 flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-3 mb-2">
              <h2 className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                {section.title}
              </h2>
            </div>

            <nav className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/${subdomain}${item.path}`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-150 ${
                    item.id === isActive
                      ? 'bg-white/20 backdrop-blur-sm text-white font-medium border-l-2 border-yellow-400'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => handleClick(item.id)}
                >
                  {React.createElement(item.icon, {
                    className: `h-4 w-4 mr-3 ${
                      item.id === isActive ? 'text-yellow-400' : 'text-blue-200'
                    }`,
                  })}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-blue-600/30 bg-blue-800/40 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-md p-2 w-full">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-xs text-blue-100">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingSidebar;
