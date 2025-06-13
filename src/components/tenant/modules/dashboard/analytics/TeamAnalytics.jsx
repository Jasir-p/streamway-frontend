import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { CheckCircle, Clock, AlertTriangle, Users, Calendar, TrendingUp, Activity, Target, Award } from 'lucide-react';

export default function TeamTaskAnalytics() {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Sample task management data
  const teamTaskData = [
    {
      teamId: 1,
      teamName: 'Sales Team',
      members: 8,
      tasks: {
        total: 245,
        completed: 189,
        inProgress: 32,
        overdue: 15,
        pending: 9,
        completionRate: 77.1,
        avgCompletionTime: 3.2
      },
      productivity: {
        thisWeek: 42,
        lastWeek: 38,
        efficiency: 85.2
      }
    },
    {
      teamId: 2,
      teamName: 'Marketing Team',
      members: 6,
      tasks: {
        total: 198,
        completed: 156,
        inProgress: 25,
        overdue: 8,
        pending: 9,
        completionRate: 78.8,
        avgCompletionTime: 2.8
      },
      productivity: {
        thisWeek: 35,
        lastWeek: 31,
        efficiency: 88.1
      }
    },
    {
      teamId: 3,
      teamName: 'Support Team',
      members: 5,
      tasks: {
        total: 312,
        completed: 267,
        inProgress: 28,
        overdue: 12,
        pending: 5,
        completionRate: 85.6,
        avgCompletionTime: 1.5
      },
      productivity: {
        thisWeek: 58,
        lastWeek: 52,
        efficiency: 91.3
      }
    },
    {
      teamId: 4,
      teamName: 'Development Team',
      members: 10,
      tasks: {
        total: 156,
        completed: 118,
        inProgress: 22,
        overdue: 10,
        pending: 6,
        completionRate: 75.6,
        avgCompletionTime: 5.2
      },
      productivity: {
        thisWeek: 28,
        lastWeek: 25,
        efficiency: 82.4
      }
    }
  ];

  // Weekly task completion trend
  const weeklyTrend = [
    { week: 'Week 1', completed: 85, created: 92 },
    { week: 'Week 2', completed: 92, created: 88 },
    { week: 'Week 3', completed: 78, created: 95 },
    { week: 'Week 4', completed: 108, created: 102 },
    { week: 'Week 5', completed: 95, created: 89 }
  ];

  // Task priority distribution
  const priorityData = [
    { name: 'High Priority', value: 125, color: '#ef4444' },
    { name: 'Medium Priority', value: 234, color: '#f59e0b' },
    { name: 'Low Priority', value: 156, color: '#10b981' },
    { name: 'Critical', value: 42, color: '#dc2626' }
  ];

  // Team comparison data
  const teamComparison = teamTaskData.map(team => ({
    name: team.teamName.split(' ')[0],
    completed: team.tasks.completed,
    efficiency: team.productivity.efficiency,
    overdue: team.tasks.overdue,
    completionRate: team.tasks.completionRate
  }));

  const getSelectedTeamData = () => {
    if (selectedTeam === 'all') {
      return {
        total: teamTaskData.reduce((sum, team) => sum + team.tasks.total, 0),
        completed: teamTaskData.reduce((sum, team) => sum + team.tasks.completed, 0),
        inProgress: teamTaskData.reduce((sum, team) => sum + team.tasks.inProgress, 0),
        overdue: teamTaskData.reduce((sum, team) => sum + team.tasks.overdue, 0),
        pending: teamTaskData.reduce((sum, team) => sum + team.tasks.pending, 0),
        members: teamTaskData.reduce((sum, team) => sum + team.members, 0),
        avgEfficiency: (teamTaskData.reduce((sum, team) => sum + team.productivity.efficiency, 0) / teamTaskData.length).toFixed(1)
      };
    }
    const team = teamTaskData.find(t => t.teamId === parseInt(selectedTeam));
    if (!team) return { total: 0, completed: 0, inProgress: 0, overdue: 0, pending: 0, members: 0, avgEfficiency: 0 };
    return {
      total: team.tasks.total,
      completed: team.tasks.completed,
      inProgress: team.tasks.inProgress,
      overdue: team.tasks.overdue,
      pending: team.tasks.pending,
      members: team.members,
      avgEfficiency: team.productivity.efficiency
    };
  };

  const selectedData = getSelectedTeamData();
  const completionRate = selectedData.total > 0 ? ((selectedData.completed / selectedData.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Task Management Analytics</h1>
        <p className="text-gray-600">Monitor team productivity and task completion performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Teams</option>
              {teamTaskData.map(team => (
                <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.total}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">{completionRate}% completion rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.pending}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.members}</p>
            </div>
            <Users className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">{selectedData.avgEfficiency}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 4.2% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Task Completion Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="created" stackId="2" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Team Efficiency Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Efficiency Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#8b5cf6" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate by Team</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={teamComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Line type="monotone" dataKey="completionRate" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Performance Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamTaskData.map((team) => (
                <tr key={team.teamId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {team.teamName.split(' ')[0][0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.tasks.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{team.tasks.completed}</div>
                    <div className="text-xs text-gray-500">{team.tasks.completionRate}% rate</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.tasks.inProgress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      team.tasks.overdue <= 5 
                        ? 'bg-green-100 text-green-800' 
                        : team.tasks.overdue <= 10 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {team.tasks.overdue}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            team.productivity.efficiency >= 85 ? 'bg-green-500' : 
                            team.productivity.efficiency >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${team.productivity.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{team.productivity.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.tasks.avgCompletionTime} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">This Week vs Last Week</h4>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasks Completed</span>
              <span className="text-sm font-medium text-gray-900">
                {teamTaskData.reduce((sum, team) => sum + team.productivity.thisWeek, 0)} 
                <span className="text-green-600 ml-1">
                  (+{teamTaskData.reduce((sum, team) => sum + (team.productivity.thisWeek - team.productivity.lastWeek), 0)})
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Efficiency</span>
              <span className="text-sm font-medium text-gray-900">
                {(teamTaskData.reduce((sum, team) => sum + team.productivity.efficiency, 0) / teamTaskData.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Top Performing Team</h4>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          {(() => {
            const topTeam = teamTaskData.reduce((prev, current) => 
              prev.productivity.efficiency > current.productivity.efficiency ? prev : current
            );
            return (
              <div className="space-y-2">
                <div className="text-lg font-semibold text-gray-900">{topTeam.teamName}</div>
                <div className="text-sm text-gray-600">{topTeam.productivity.efficiency}% efficiency</div>
                <div className="text-sm text-gray-600">{topTeam.tasks.completionRate}% completion rate</div>
              </div>
            );
          })()}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Needs Attention</h4>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Total Overdue: <span className="font-medium text-red-600">
                {teamTaskData.reduce((sum, team) => sum + team.tasks.overdue, 0)} tasks
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Highest Overdue: <span className="font-medium text-red-600">
                {teamTaskData.reduce((prev, current) => 
                  prev.tasks.overdue > current.tasks.overdue ? prev : current
                ).teamName}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Stats</h4>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Total Members: <span className="font-medium text-gray-900">
                {teamTaskData.reduce((sum, team) => sum + team.members, 0)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Active Teams: <span className="font-medium text-gray-900">
                {teamTaskData.length}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Overall Progress: <span className="font-medium text-green-600">
                {((teamTaskData.reduce((sum, team) => sum + team.tasks.completed, 0) / 
                   teamTaskData.reduce((sum, team) => sum + team.tasks.total, 0)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}