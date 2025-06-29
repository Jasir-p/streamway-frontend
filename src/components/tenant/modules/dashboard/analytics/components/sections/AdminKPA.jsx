import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Users, Target, TrendingUp, Calendar, CheckCircle, Clock, 
  DollarSign, Phone, Mail, Award, Filter, Download, Globe, 
  Facebook, Linkedin, Search, UserPlus, Share2
} from 'lucide-react';
import { KPACard } from '../card/KPACard';
import { getSourceIcon } from '../../utils/getSourceIcon';

 export const AdminKPA= ({tenantData}) => {




const totalLeads =tenantData?.leads?.total_leads

const totalWonLeads =tenantData?.leads?.converted_leads
const conversionRate = totalLeads > 0 ?Math.round((totalWonLeads / totalLeads) * 100):0;
const totalLostLeads =tenantData?.leads?.lost_leads
const totalClosedValue =tenantData?.deals?.deal_value
const activeAccount =tenantData?.accounts?.active_accounts
const totalDeals =tenantData?.deals?.total_deals
const totalWonDeals =tenantData?.deals?.converted_deals
const totalLostDeals =tenantData?.deals?.lost_deals
const totalOpenDeals = totalDeals - (totalWonDeals + totalLostDeals);


const leadSourcesData = tenantData?.leads?.lead_source?.map((item) => {
  const { color, icon } = getSourceIcon(item.source);
  const percentage = ((item.count / totalLeads) * 100).toFixed(1); // as percentage
  return {
    name: item.source.charAt(0).toUpperCase() + item.source.slice(1),
    count: item.count,
    percentage: percentage,
    color: color,
    icon: icon,
  };
});



  // Data for performance visualization (universal for B2B/B2C)
  const FunnelData = [
    { name: 'Total Leads', value: totalLeads, fill: '#3B82F6' },
    { name: 'Converted Leads', value: totalWonDeals, fill: '#10B981' },
    { name: 'Total Deals', value: totalDeals, fill: '#8B5CF6' },
    { name: 'ClosedWon', value: totalWonDeals, fill: '#F59E0B' }
  ];

  // Sample revenue/sales data
  const sampleRevenueData = [
    { month: 'Jan', revenue: 180000 },
    { month: 'Feb', revenue: 195000 },
    { month: 'Mar', revenue: 210000 },
    { month: 'Apr', revenue: 225000 },
    { month: 'May', revenue: 231000 }
  ];

  const useFunnelData = FunnelData;
  const useRevenueData = sampleRevenueData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPACard 
          title="ClosedWon Value" 
          value={totalClosedValue} 
          subtitle="This month"
          icon={DollarSign}
          color="text-green-600"
          trend="+18% from last month"
        />
        <KPACard 
          title="Total Leads" 
          value={totalLeads} 
          subtitle="All channels"
          icon={Users}
          color="text-blue-600"
          trend="+12% from last month"
        />
        <KPACard 
          title="Conversion Rate" 
          value={`${conversionRate}%`}
          subtitle="Lead to sale"
          icon={Target}
          color="text-purple-600"
          trend="+3% from last month"
        />
        <KPACard 
          title="Active Customers" 
          value={activeAccount} 
          subtitle="Customer base"
          icon={Award}
          color="text-orange-600"
          trend="+8% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leads & Deals Performance</h3>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Leads</p>
                  <p className="text-2xl font-bold text-blue-800">{totalLeads}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Won: {totalWonLeads}</span>
                  <span className="text-red-500">Lost: {totalLostLeads}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(totalWonLeads / totalLeads) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Win Rate: {Math.round((totalWonLeads / totalLeads) * 100)}%
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Deals</p>
                  <p className="text-2xl font-bold text-purple-800">{totalDeals}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Closed Won: {totalWonDeals}</span>
                  <span className="text-orange-500">Open: {totalOpenDeals}</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(totalWonDeals / totalDeals) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Close Won Rate: {Math.round((totalWonDeals / totalDeals) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Funnel Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <FunnelChart>
              <Funnel
                dataKey="value"
                data={useFunnelData}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
              <Tooltip />
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ClosedWon Value Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={useRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${(value/1000).toFixed(0)}K`, 'ClosedWon Value']} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lead Generation</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm font-medium">70%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Satisfaction</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sales Performance</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Lead Sources</h3>
            <div className="text-sm text-gray-500">This Month</div>
          </div>
          
          {/* Lead Sources List */}
          <div className="space-y-4">
            {leadSourcesData?.map((source, index) => {
              const IconComponent = source.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div 
                      className="p-2 rounded-lg mr-3"
                      style={{ backgroundColor: `${source.color}20` }}
                    >
                      <IconComponent 
                        className="w-4 h-4" 
                        style={{ color: source.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.percentage}% of total leads</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${source.percentage}%`,
                          backgroundColor: source.color
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
                      {source.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Leads Generated</span>
              <span className="font-semibold text-gray-800">{totalLeads}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

