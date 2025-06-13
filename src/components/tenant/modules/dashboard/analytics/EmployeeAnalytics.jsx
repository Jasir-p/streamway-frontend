import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, CheckCircle, DollarSign, TrendingUp, Award, Calendar, Filter } from 'lucide-react';

export default function EmployeeKPIAnalytics() {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Sample data for employee performance
  const employeeData = [
    {
      id: 1,
      name: 'John Smith',
      leads: { generated: 45, converted: 12, conversionRate: 26.7 },
      tasks: { completed: 78, pending: 12, overdue: 3 },
      deals: { closed: 8, value: 125000, pipeline: 85000 },
      accounts: { assigned: 15, active: 13, inactive: 2 }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      leads: { generated: 52, converted: 18, conversionRate: 34.6 },
      tasks: { completed: 89, pending: 8, overdue: 1 },
      deals: { closed: 12, value: 185000, pipeline: 120000 },
      accounts: { assigned: 18, active: 16, inactive: 2 }
    },
    {
      id: 3,
      name: 'Mike Davis',
      leads: { generated: 38, converted: 9, conversionRate: 23.7 },
      tasks: { completed: 65, pending: 15, overdue: 5 },
      deals: { closed: 6, value: 95000, pipeline: 65000 },
      accounts: { assigned: 12, active: 10, inactive: 2 }
    },
    {
      id: 4,
      name: 'Emily Chen',
      leads: { generated: 48, converted: 15, conversionRate: 31.3 },
      tasks: { completed: 82, pending: 10, overdue: 2 },
      deals: { closed: 10, value: 155000, pipeline: 95000 },
      accounts: { assigned: 16, active: 14, inactive: 2 }
    }
  ];

  // Performance comparison data
  const performanceData = employeeData.map(emp => ({
    name: emp.name.split(' ')[0],
    leads: emp.leads.generated,
    tasks: emp.tasks.completed,
    deals: emp.deals.closed,
    revenue: emp.deals.value / 1000
  }));

  // Conversion rate data
  const conversionData = employeeData.map(emp => ({
    name: emp.name.split(' ')[0],
    rate: emp.leads.conversionRate
  }));

  // Deal pipeline data
  const pipelineData = [
    { name: 'Closed Deals', value: employeeData.reduce((sum, emp) => sum + emp.deals.value, 0) },
    { name: 'Pipeline', value: employeeData.reduce((sum, emp) => sum + emp.deals.pipeline, 0) }
  ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const getSelectedEmployeeData = () => {
    if (selectedEmployee === 'all') {
      return {
        leads: employeeData.reduce((sum, emp) => sum + emp.leads.generated, 0),
        tasks: employeeData.reduce((sum, emp) => sum + emp.tasks.completed, 0),
        deals: employeeData.reduce((sum, emp) => sum + emp.deals.closed, 0),
        revenue: employeeData.reduce((sum, emp) => sum + emp.deals.value, 0),
        accounts: employeeData.reduce((sum, emp) => sum + emp.accounts.assigned, 0),
        conversionRate: (employeeData.reduce((sum, emp) => sum + emp.leads.converted, 0) / 
                        employeeData.reduce((sum, emp) => sum + emp.leads.generated, 0) * 100).toFixed(1)
      };
    }
    const emp = employeeData.find(e => e.id === parseInt(selectedEmployee));
    return {
      leads: emp.leads.generated,
      tasks: emp.tasks.completed,
      deals: emp.deals.closed,
      revenue: emp.deals.value,
      accounts: emp.accounts.assigned,
      conversionRate: emp.leads.conversionRate
    };
  };

  const selectedData = getSelectedEmployeeData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee KPI Analytics</h1>
        <p className="text-gray-600">Track individual performance across leads, tasks, deals, and accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Employees</option>
              {employeeData.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads Generated</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.leads}</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.tasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deals Closed</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.deals}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Generated</p>
              <p className="text-2xl font-bold text-gray-900">${(selectedData.revenue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 22% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.accounts}</p>
            </div>
            <Users className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-xs text-blue-600 mt-2">Active management</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.conversionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 3.2% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="#8b5cf6" name="Leads" />
              <Bar dataKey="tasks" fill="#06b6d4" name="Tasks" />
              <Bar dataKey="deals" fill="#10b981" name="Deals" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Conversion Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Employee Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Individual Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accounts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.leads.generated}</div>
                    <div className="text-xs text-gray-500">{employee.leads.converted} converted</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.tasks.completed}</div>
                    <div className="text-xs text-gray-500">{employee.tasks.pending} pending</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.deals.closed}</div>
                    <div className="text-xs text-gray-500">${(employee.deals.pipeline / 1000).toFixed(0)}K pipeline</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${(employee.deals.value / 1000).toFixed(0)}K</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.accounts.assigned}</div>
                    <div className="text-xs text-gray-500">{employee.accounts.active} active</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.leads.conversionRate >= 30 
                        ? 'bg-green-100 text-green-800' 
                        : employee.leads.conversionRate >= 25 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.leads.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}