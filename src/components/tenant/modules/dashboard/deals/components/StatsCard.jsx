import React from 'react';

export const StatsCard = ({ icon: Icon, value, label, bgColor, iconColor }) => (
  <div className="bg-white rounded-lg shadow-sm  p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  </div>
);