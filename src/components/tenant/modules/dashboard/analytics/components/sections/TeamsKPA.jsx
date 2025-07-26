import { KPACard } from "../card/KPACard";
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Users, Target, TrendingUp, Calendar, CheckCircle, Clock, 
  DollarSign, Phone, Mail, Award, Filter, Download, AlertCircle
} from 'lucide-react';
import { mapteamStats } from "../../utils/filterEmployeeData";

// No Data Component
const NoDataMessage = ({ message = "No data available" }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <AlertCircle size={48} className="mb-4 text-gray-300" />
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm text-gray-400 mt-1">New joinee - Tasks will appear once assigned</p>
  </div>
);

// Component to show individual team member status
const TeamMemberRow = ({ team, index }) => {
  const hasData = team.totalTasks > 0;
  
  if (!hasData) {
    return (
      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-3 px-4 font-medium">{team.name || 'Unknown Team'}</td>
        <td className="py-3 px-4 text-gray-400">-</td>
        <td className="py-3 px-4 text-gray-400">-</td>
        <td className="py-3 px-4">
          <span className="text-sm text-gray-400 italic">New joinee - No data available</span>
        </td>
        <td className="py-3 px-4 text-gray-400">-</td>
      </tr>
    );
  }

  return (
    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium">{team.name}</td>
      <td className="py-3 px-4">{team.totalTasks}</td>
      <td className="py-3 px-4 text-green-600">{team.totalComplete || 0}</td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ 
                width: team.totalTasks > 0 
                  ? `${(team.totalComplete / team.totalTasks) * 100}%` 
                  : "0%" 
              }}
            ></div>
          </div>
          <span className="text-sm">
            {team.totalTasks > 0 
              ? `${Math.round((team.totalComplete / team.totalTasks) * 100)}%` 
              : "0%"}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-red-600">{team.totalDue || 0}</td>
    </tr>
  );
};

export const TeamsKPA = ({ teamTaskData }) => {
  // Check if data exists and is valid
  const hasData = teamTaskData && Array.isArray(teamTaskData) && teamTaskData.length > 0;
  
  // If no data, show the no data state
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPACard 
            title="Total Tasks" 
            value={0} 
            subtitle="No data available"
            icon={CheckCircle}
            color="text-gray-400"
          />
          <KPACard 
            title="Completed" 
            value={0}
            subtitle="No data available"
            icon={Target}
            color="text-gray-400"
          />
          <KPACard 
            title="Pending" 
            value={0}
            subtitle="No data available"
            icon={Clock}
            color="text-gray-400"
          />
          <KPACard 
            title="Overdue" 
            value={0}
            subtitle="No data available"
            icon={Calendar}
            color="text-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h3>
            <NoDataMessage message="No task status data available" />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
            <NoDataMessage message="No team performance data available" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Task Summary</h3>
          <NoDataMessage message="No team summary data available" />
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalTask = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.total_task || 0), 0);
  const totaldue = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.due_task || 0), 0);
  const totalCompleted = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.completed_task || 0), 0);
  const totalPending = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.pending_task || 0), 0);

  const taskStatusData = [
    { name: 'Completed', value: totalCompleted, color: '#10B981' },
    { name: 'Pending', value: totalPending, color: '#F59E0B' },
    { name: 'Overdue', value: totaldue, color: '#EF4444' }
  ];

  const teamStats = mapteamStats(teamTaskData);
  
  // Check if we have meaningful data to display
  const hasTaskData = totalTask > 0;
  const hasTeamStats = teamStats && teamStats.length > 0;
  
  // Filter teams with data for charts (exclude new joiners from aggregated charts)
  const teamsWithData = teamStats.filter(team => team.totalTasks > 0);
  const hasChartsData = teamsWithData.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPACard 
          title="Total Tasks" 
          value={totalTask} 
          subtitle={hasTaskData ? "Across all teams" : "No tasks assigned"}
          icon={CheckCircle}
          color={hasTaskData ? "text-blue-600" : "text-gray-400"}
        />
        <KPACard 
          title="Completed" 
          value={totalCompleted}
          subtitle={hasTaskData ? `${totalTask > 0 ? ((totalCompleted / totalTask) * 100).toFixed(1) : 0}% completion rate` : "No completed tasks"}
          icon={Target}
          color={hasTaskData ? "text-green-600" : "text-gray-400"}
        />
        <KPACard 
          title="Pending" 
          value={totalPending}
          subtitle={hasTaskData ? `${totalTask > 0 ? ((totalPending / totalTask) * 100).toFixed(1) : 0}% pending` : "No pending tasks"}
          icon={Clock}
          color={hasTaskData ? "text-yellow-600" : "text-gray-400"}
        />
        <KPACard 
          title="Overdue" 
          value={totaldue}
          subtitle={hasTaskData ? `${totalTask > 0 ? ((totaldue / totalTask) * 100).toFixed(1) : 0}% overdue` : "No overdue tasks"}
          icon={Calendar}
          color={hasTaskData ? "text-red-600" : "text-gray-400"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h3>
          {hasChartsData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="All team members are new joiners" />
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
          {hasChartsData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={teamsWithData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey='name' 
                  interval={0}
                  angle={-30}
                  textAnchor='end'
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalComplete" fill="#10B981" name="Completed" />
                <Bar dataKey="totalPending" fill="#F59E0B" name="Pending" />
                <Bar dataKey="totalDue" fill="#EF4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="All team members are new joiners" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Task Summary</h3>
        {hasTeamStats ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Team</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Assigned</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Completed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Completion Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Overdue</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((team, index) => (
                  <TeamMemberRow key={index} team={team} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoDataMessage message="No team summary data to display" />
        )}
      </div>
    </div>
  );
};