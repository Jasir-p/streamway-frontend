import { DealsCard } from "./components/DealsCard";
import { QuickActions } from "./components/QuickActions";
import { UpcomingMeetings } from "./components/UpcomingMeetings";
import { StatCard } from "./components/StatCard";
import { TaskCard } from "./components/TaskCard";
import { RecentLeadsTable } from "./components/RecentLeadsTable";
import { useDashboard } from "./hooks/useDashboard";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar, 
  DollarSign, 
  ChevronDown
} from 'lucide-react';
import DashboardLayout from "./DashbordLayout";


const CRMHomePage = () => {
  const { dashboardData, isLoading, error } = useDashboard();
  const [dateRange, setDateRange] = useState('This Month');
  
  // Sample data
  // const dashboardData = {
  //   totalLeadsThisMonth: 142,
  //   activeOpportunities: 28,
  //   pendingTasks: 15,
  //   upcomingMeetings: 8,
  //   totalDealValue: '₹12,45,000'
  // };

  return (
    <DashboardLayout>
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
            </div>
            
            
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users />} label="New Leads" value={dashboardData.leadCount} trend="12" />
          <StatCard icon={<TrendingUp />} label="Deals" value={dashboardData.dealCount} trend="8" />
          <StatCard icon={<Clock />} label="Pending Tasks" value={dashboardData.pendingTaskCount} />
          <StatCard icon={<Calendar />} label="Upcoming Meetings" value={dashboardData.upcomingMeetingsCount} />
          {/* <StatCard icon={<DollarSign />} label="Pipeline Value" value={dashboardData.totalDealValue} trend="15" /> */}
        </div>

        {/* Quick Actions */}
        {/* <div className="mb-8">
          <QuickActions />
        </div> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Active Deals */}
          <DealsCard deals={dashboardData?.recentDeals} />
          
          {/* Upcoming Meetings */}
          <UpcomingMeetings meetings={dashboardData.upcomingMeetings} />
        </div>

        {/* Tasks Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TaskCard title="Overdue Tasks" tasks={dashboardData.overdueTasks} isOverdue={true} />
          <TaskCard title="Today's Tasks" tasks={dashboardData.dueTodayTasks} />
        </div>

        {/* Recent Leads Table */}
        <div className="mb-8">
          <RecentLeadsTable leads={dashboardData.recentLeads} />
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default CRMHomePage;