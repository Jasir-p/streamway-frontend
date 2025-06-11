import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar, 
  DollarSign, 
  Plus,
  Mail,
  UserPlus,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const [dateRange, setDateRange] = useState('This Month');
  const [dashboardData, setDashboardData] = useState({
    totalLeadsThisMonth: 142,
    activeOpportunities: 28,
    pendingTasks: 15,
    upcomingMeetings: 8,
    totalDealValue: '₹12,45,000'
  });

  // Deals/Opportunities data
  const dealsData = [
    { name: 'ABC Technologies', value: 150000, stage: 'Negotiation', probability: 80, rep: 'Sarah' },
    { name: 'XYZ Solutions', value: 85000, stage: 'Proposal', probability: 60, rep: 'John' },
    { name: 'Global Corp', value: 200000, stage: 'Discovery', probability: 40, rep: 'Mike' },
    { name: 'StartUp Inc', value: 45000, stage: 'Qualified', probability: 70, rep: 'Sarah' },
    { name: 'Tech Innovators', value: 120000, stage: 'Negotiation', probability: 90, rep: 'John' },
    { name: 'Digital Solutions', value: 75000, stage: 'Proposal', probability: 50, rep: 'Mike' }
  ];

  // Lead sources data
  const leadSourcesData = [
    { name: 'Website', value: 35, color: '#3B82F6' },
    { name: 'Social Media', value: 25, color: '#10B981' },
    { name: 'Referral', value: 20, color: '#F59E0B' },
    { name: 'Cold Call', value: 15, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#EF4444' }
  ];

  // Weekly summary data
  const weeklySummaryData = [
    { day: 'Mon', leads: 8, deals: 2 },
    { day: 'Tue', leads: 12, deals: 3 },
    { day: 'Wed', leads: 15, deals: 1 },
    { day: 'Thu', leads: 10, deals: 4 },
    { day: 'Fri', leads: 18, deals: 2 },
    { day: 'Sat', leads: 6, deals: 1 },
    { day: 'Sun', leads: 4, deals: 0 }
  ];



  // Tasks data
  const overdueTasks = [
    { id: 1, title: 'Follow up with Rahul Tech', assignee: 'John', dueDate: '2 days ago' },
    { id: 2, title: 'Send proposal to MegaCorp', assignee: 'Sarah', dueDate: '1 day ago' },
    { id: 3, title: 'Schedule demo call', assignee: 'Mike', dueDate: '3 days ago' }
  ];

  const todayTasks = [
    { id: 1, title: 'Call new leads batch', assignee: 'Sarah', dueDate: 'Today 2:00 PM' },
    { id: 2, title: 'Prepare presentation slides', assignee: 'John', dueDate: 'Today 4:00 PM' },
    { id: 3, title: 'Email follow-up sequence', assignee: 'Mike', dueDate: 'Today 5:30 PM' }
  ];

  // Recent leads
  const recentLeads = [
    { id: 1, name: 'Anjali Verma', phone: '+91 98765 43210', assignedTo: 'Sarah', source: 'Website', status: 'New' },
    { id: 2, name: 'Rajesh Gupta', phone: '+91 87654 32109', assignedTo: 'John', source: 'Referral', status: 'Contacted' },
    { id: 3, name: 'Meera Singh', phone: '+91 76543 21098', assignedTo: 'Mike', source: 'Social Media', status: 'Qualified' },
    { id: 4, name: 'Arjun Patel', phone: '+91 65432 10987', assignedTo: 'Sarah', source: 'Cold Call', status: 'New' },
    { id: 5, name: 'Kavya Nair', phone: '+91 54321 09876', assignedTo: 'John', source: 'Website', status: 'Contacted' }
  ];

  // Upcoming meetings
  const upcomingMeetings = [
    { id: 1, date: 'Today', time: '2:00 PM', contact: 'ABC Technologies', topic: 'Product Demo', rep: 'Sarah' },
    { id: 2, date: 'Tomorrow', time: '10:30 AM', contact: 'XYZ Solutions', topic: 'Proposal Discussion', rep: 'John' },
    { id: 3, date: 'Jun 10', time: '3:00 PM', contact: 'Global Corp', topic: 'Contract Review', rep: 'Mike' },
    { id: 4, date: 'Jun 11', time: '11:00 AM', contact: 'StartUp Inc', topic: 'Initial Meeting', rep: 'Sarah' }
  ];

  // Card component
  const Card = ({ icon, label, value, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="text-green-500 text-sm font-medium">
            +{trend}%
          </div>
        )}
      </div>
    </div>
  );

  // Task Card component
  const TaskCard = ({ title, tasks, isOverdue = false }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className={`text-lg font-semibold mb-4 ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
        {title} ({tasks.length})
      </h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">{task.title}</p>
              <p className="text-sm text-gray-600">Assigned to: {task.assignee}</p>
            </div>
            <div className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
              {task.dueDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Won': return 'bg-emerald-100 text-emerald-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
          </div>
          
          {/* Date Range Filter */}
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card icon={<Users />} label="New Leads" value={dashboardData.totalLeadsThisMonth} trend="12" />
        <Card icon={<TrendingUp />} label="Opportunities" value={dashboardData.activeOpportunities} trend="8" />
        <Card icon={<Clock />} label="Pending Tasks" value={dashboardData.pendingTasks} />
        <Card icon={<Calendar />} label="Upcoming Meetings" value={dashboardData.upcomingMeetings} />
        <Card icon={<DollarSign />} label="Pipeline Value" value={dashboardData.totalDealValue} trend="15" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Clock className="h-4 w-4" />
            <span>Add Task</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <Mail className="h-4 w-4" />
            <span>Send Email</span>
          </button>
          <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Create Team</span>
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Deals/Opportunities */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Active Deals</h3>
          <div className="space-y-4">
            {dealsData.map((deal, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{deal.name}</h4>
                  <span className="text-lg font-bold text-green-600">₹{deal.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Stage: <span className="font-medium">{deal.stage}</span></span>
                  <span>Rep: <span className="font-medium">{deal.rep}</span></span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Probability</span>
                    <span>{deal.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${deal.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Weekly Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklySummaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="deals" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <TaskCard title="Overdue Tasks" tasks={overdueTasks} isOverdue={true} />
        <TaskCard title="Today's Tasks" tasks={todayTasks} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads Table */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Leads</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-600">Lead Name</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Phone</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Assigned To</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">{lead.name}</td>
                    <td className="py-3 text-gray-600">{lead.phone}</td>
                    <td className="py-3 text-gray-600">{lead.assignedTo}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Meetings</h3>
          <div className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h4 className="font-medium text-gray-800">{meeting.contact}</h4>
                  <p className="text-sm text-gray-600">{meeting.topic}</p>
                  <p className="text-sm text-gray-500">Rep: {meeting.rep}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{meeting.date}</p>
                  <p className="text-sm text-gray-600">{meeting.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;