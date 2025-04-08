import React from 'react';
import Sidebar from './Slidebar';
import { Users, Sparkles, ShoppingBag, Briefcase, Search, Bell, Settings2Icon, Settings } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Navbar from '../../common/Navbar';
import { useSelector } from 'react-redux';





function Dashboard() {
  const role=useSelector((state)=>state.auth.role)
  const permission = useSelector((state) => state.auth.permissions);
  const profile = useSelector((state) => state.profile.name);
  const sub = localStorage.getItem("subdomain")
  console.log("jasir",sub)
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
      
      <div className="flex-1">
        {/* Header */}
        <Navbar/>

        
        <h1>welcome{profile}
          {role}
          
        </h1>
      </div>
    </div>
  );
}



export default Dashboard;