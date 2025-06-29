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
import { KPACard } from '../card/KPACard';
import { mapEmployeeStats } from '../../utils/filterEmployeeData';


// Empty state component
const EmptyDataMessage = ({ message, icon: Icon = AlertCircle }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <Icon className="w-12 h-12 mb-4 text-gray-300" />
    <p className="text-lg font-medium text-gray-600">{message}</p>
    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
  </div>
);

// Loading skeleton component
const TableSkeleton = ({ rows = 3, cols = 4 }) => (
  <div className="animate-pulse">
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const EmployeesKPA = ({ employeeData = [] }) => {
  // Safely handle data - ensure arrays exist
  const safeEmployeeData = Array.isArray(employeeData) ? employeeData : [];
  
  
  // Check if we have data
  const hasEmployeeData = safeEmployeeData.length > 0;


  // Calculate totals with safe fallbacks
const totalOwnLeads = safeEmployeeData.reduce((sum, emp) => sum + (emp?.lead_stats?.own_leads || 0), 0);
const totalSubordinateLeads = safeEmployeeData.reduce((sum, emp) => sum + (emp?.lead_stats?.subordinate_leads || 0), 0);
const totalLeads = totalOwnLeads + totalSubordinateLeads;

const totalOwnConversions = safeEmployeeData.reduce((sum, emp) => sum + (emp?.deal_stats?.converted_deals || 0), 0);
// Assuming no separate subordinate_conversions given in your data
const totalConversions = totalOwnConversions;

const totalOwnDeals = safeEmployeeData.reduce((sum, emp) => sum + (emp?.deal_stats?.own_deals || 0), 0);
const totalSubordinateDeals = safeEmployeeData.reduce((sum, emp) => sum + (emp?.deal_stats?.subordinate_deals || 0), 0);
const totalDeals = totalOwnDeals + totalSubordinateDeals;

const totalOwnMeetings = safeEmployeeData.reduce((sum, emp) => sum + (emp?.meeting_stats?.own_meeting || 0), 0);
const totalSubordinateMeetings = safeEmployeeData.reduce((sum, emp) => sum + (emp?.meeting_stats?.subordinate_meeting || 0), 0);
const totalMeetings = totalOwnMeetings + totalSubordinateMeetings;

const totalOwnTasks = safeEmployeeData.reduce((sum, emp) => sum + (emp?.task_stats?.own_task || 0), 0);
const totalSubordinateTasks = safeEmployeeData.reduce((sum, emp) => sum + (emp?.task_stats?.subordinate_task || 0), 0);
const totalTasks = totalOwnTasks + totalSubordinateTasks;

console.log(safeEmployeeData);

const mappedEmployeeData = mapEmployeeStats(employeeData)
const radarData = [
    { subject: 'Leads', A: 120, B: 110, fullMark: 150 },
    { subject: 'Conversions', A: 98, B: 130, fullMark: 150 },
    { subject: 'Deals', A: 86, B: 130, fullMark: 150 },
    { subject: 'Meetings', A: 99, B: 100, fullMark: 150 },
    { subject: 'Tasks', A: 85, B: 90, fullMark: 150 },
    { subject: 'Accounts', A: 65, B: 85, fullMark: 150 }
  ];

const safeRadarData = Array.isArray(radarData) ? radarData : [];
  const hasRadarData = safeRadarData.length > 0;
  return (
    <div className="space-y-6">
      {/* KPA Cards - Always show with 0 values if no data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPACard 
          title="Total Leads" 
          value={totalLeads.toString()} 
          
          icon={Users}
          color="text-blue-600"
          trend={hasEmployeeData ? "+15% from last month" : "No trend data"}
        />
        <KPACard 
          title="Conversions" 
          value={totalConversions.toString()} 
          
          icon={Target}
          color="text-green-600"
          trend={hasEmployeeData ? "+5% from last month" : "No trend data"}
        />
        <KPACard 
          title="Deals Closed" 
          value={totalDeals.toString()} 
          
          icon={DollarSign}
          color="text-purple-600"
          trend={hasEmployeeData ? "+22% from last month" : "No trend data"}
        />
        <KPACard 
          title="Meetings" 
          value={totalMeetings.toString()} 
          
          icon={Calendar}
          color="text-orange-600"
          trend={hasEmployeeData ? "+8% from last month" : "No trend data"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Performance Comparison</h3>
          {hasRadarData ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={safeRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="John Smith" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Radar name="Sarah Johnson" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyDataMessage message="No performance comparison data available" />
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performers</h3>
          {hasEmployeeData ? (
            <div className="space-y-4">
              {mappedEmployeeData
                .sort((a, b) => (b?.totalRevenue || 0) - (a?.totalRevenue || 0))
                .slice(0, 4)
                .map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{employee?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">
                      Own: {employee?.ownDeals || 0} | Subordinates: {employee?.subordinateDeals || 0} →{" "}
                      {(employee?.ownDeals || 0) + (employee?.subordinateDeals || 0)} deals closed
                    </p>

                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${(employee?.totalRevenue || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyDataMessage message="No employee performance data available" icon={Award} />
          )}
        </div>
      </div>

      {/* RBAC-based detailed tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leads Breakdown</h3>
          {hasEmployeeData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Own Leads</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subordinate Leads</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedEmployeeData.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{employee?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-blue-600">{employee?.ownLeads || 0}</td>
                      <td className="py-3 px-4 text-gray-600">{employee?.subordinateLeads || 0}</td>
                      <td className="py-3 px-4 font-semibold">{(employee?.ownLeads || 0) + (employee?.subordinateLeads || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyDataMessage message="No leads data available" />
          )}
        </div>

        {/* Deals Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Deals Breakdown</h3>
          {hasEmployeeData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Own Deals</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subordinate Deals</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedEmployeeData.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{employee?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-purple-600">{employee?.ownDeals || 0}</td>
                      <td className="py-3 px-4 text-gray-600">{employee?.subordinateDeals || 0}</td>
                      <td className="py-3 px-4 font-semibold">{(employee?.ownDeals || 0) + (employee?.subordinateDeals || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyDataMessage message="No deals data available" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meetings Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Meetings Breakdown</h3>
          {hasEmployeeData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Own Meetings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subordinate Meetings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedEmployeeData.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{employee?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-orange-600">{employee?.ownMeetings || 0}</td>
                      <td className="py-3 px-4 text-gray-600">{employee?.subordinateMeetings || 0}</td>
                      <td className="py-3 px-4 font-semibold">{(employee?.ownMeetings || 0) + (employee?.subordinateMeetings || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyDataMessage message="No meetings data available" />
          )}
        </div>

        {/* Tasks Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks Breakdown</h3>
          {hasEmployeeData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Own Tasks</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subordinate Tasks</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedEmployeeData.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{employee?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-green-600">{employee?.ownTasks || 0}</td>
                      <td className="py-3 px-4 text-gray-600">{employee?.subordinateTasks || 0}</td>
                      <td className="py-3 px-4 font-semibold">{(employee?.ownTasks || 0) + (employee?.subordinateTasks || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyDataMessage message="No tasks data available" />
          )}
        </div>
      </div>

      {/* Revenue and Complete Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Complete Employee KPA Overview</h3>
        {hasEmployeeData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Own Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Subordinate Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Accounts</th>
                </tr>
              </thead>
              <tbody>
                {mappedEmployeeData.map((employee, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{employee?.name || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {employee?.role || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-600 font-medium">
                      ${(employee?.ownRevenue || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      ${(employee?.subordinateRevenue || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-green-700">
                      ${(employee?.totalRevenue || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-600">{employee?.ownAccounts || 0}</span>
                      <span className="text-gray-400"> / </span>
                      <span className="text-gray-600">{employee?.subordinateAccounts || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyDataMessage message="No employee overview data available" />
        )}
      </div>
    </div>
  );
};