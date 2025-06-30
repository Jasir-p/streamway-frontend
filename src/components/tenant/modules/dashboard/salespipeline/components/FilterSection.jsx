import React from 'react';
import { Calendar } from 'lucide-react';

const FilterSection = ({ 
  dateFilter, 
  setDateFilter, 
  customDateRange, 
  setCustomDateRange 
}) => {
  const filters = ['all', 'today', 'week', 'month', 'last-month', 'custom'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                dateFilter === filter
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'last-month' ? 'Last Month' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {dateFilter === 'custom' && (
          <div className="flex items-center space-x-2 ml-4">
            <input
              type="date"
              value={customDateRange.startDate}
              onChange={(e) => setCustomDateRange(prev => ({...prev, startDate: e.target.value}))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={customDateRange.endDate}
              onChange={(e) => setCustomDateRange(prev => ({...prev, endDate: e.target.value}))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;