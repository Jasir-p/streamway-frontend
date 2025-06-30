import { KPACard } from "../card/KPACard";
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Users, Target, TrendingUp, Calendar, CheckCircle, Clock, 
  DollarSign, Phone, Mail, Award, Filter, Download
} from 'lucide-react';
import { mapteamStats } from "../../utils/filterEmployeeData";

export const TeamsKPA = ({teamTaskData}) => {
const totalTask = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.total_task || 0), 0);
const totaldue = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.due_task || 0), 0);
const totalCompleted = teamTaskData.reduce((sum, team) =>sum + (team?.team_stats?.completed_task || 0), 0);
const totalPending = teamTaskData.reduce((sum, team) => sum + (team?.team_stats?.pending_task || 0), 0);

  const taskStatusData = [
    { name: 'Completed', value: totalCompleted, color: '#10B981' },
    { name: 'Pending', value: totalPending, color: '#F59E0B' },
    { name: 'Overdue', value: totaldue, color: '#EF4444' }
  ];
const teamStats = mapteamStats(teamTaskData)
  
  return(
    
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPACard 
          title="Total Tasks" 
          value={totalTask} 
          subtitle="Across all teams"
          icon={CheckCircle}
          color="text-blue-600"
          trend="+12% from last month"
        />
        <KPACard 
          title="Completed" 
          value={totalCompleted}
          subtitle="86.9% completion rate"
          icon={Target}
          color="text-green-600"
          trend="+8% from last month"
        />
        <KPACard 
          title="Pending" 
          value={totalPending}
          subtitle="13.1% pending"
          icon={Clock}
          color="text-yellow-600"
        />
        <KPACard 
          title="Overdue" 
          value={totaldue}
          subtitle="3.8% overdue"
          icon={Calendar}
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status Distribution</h3>
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
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='name' 
              interval={0}
              angle={-30}
              textAnchor='end'/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalComplete" fill="#10B981" name="Completed" />
              <Bar dataKey="totalPending" fill="#F59E0B" name="Pending" />
              <Bar dataKey="totalDue" fill="#EF4444" name="Overdue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Task Summary</h3>
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
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{team.name}</td>
                  <td className="py-3 px-4">{team.totalTasks}</td>
                  <td className="py-3 px-4 text-green-600">{team.totalComplete}</td>
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
                  <td className="py-3 px-4 text-red-600">{team.totalDue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}