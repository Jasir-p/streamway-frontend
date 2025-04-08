import React from 'react';
import Sidebar from './Slidebar'; // Fixed spelling
import { Users, Sparkles, ShoppingBag, Briefcase } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Navbar from '../../common/Navbar';
import { useSelector } from 'react-redux';

function DashboardLayout({children}) {
  const role = useSelector((state) => state.auth.role);
  const permission = useSelector((state) => state.auth.permissions);
  const sub = localStorage.getItem("subdomain");
  console.log("jasir", sub);
  const navigate = useNavigate();
  
  const stats = [
    { icon: Users, title: 'Active Leads', value: '178+', color: 'bg-blue-500' },
    { icon: Sparkles, title: 'Opportunities in Progress', value: '20+', color: 'bg-yellow-500' },
    { icon: ShoppingBag, title: 'Sales Products', value: '190+', color: 'bg-red-500' },
    { icon: Briefcase, title: 'Job Application', value: '12+', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Navbar />

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;