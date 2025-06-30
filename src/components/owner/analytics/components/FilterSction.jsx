import { useState } from "react";
import { Filter } from "lucide-react";


export const FilterSection = ({ filters, onFiltersChange, onApplyFilters }) => {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleFilterTypeChange = (type) => {
    setTempFilters(prev => ({ ...prev, type }));
    if (type === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      // Auto-apply for predefined filters
      const newFilters = { ...tempFilters, type };
      onFiltersChange(newFilters);
      onApplyFilters(newFilters);
    }
  };

  const handleCustomDateChange = (field, value) => {
    setTempFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomFilters = () => {
    if (tempFilters.startDate && tempFilters.endDate) {
      onFiltersChange(tempFilters);
      onApplyFilters(tempFilters);
      setShowCustomDateRange(false);
    }
  };

  const clearCustomDates = () => {
    setTempFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
    setShowCustomDateRange(false);
  };

  const filterOptions = [
    { value: 'all', label: 'All Time', icon: '📊' },
    { value: 'month', label: 'This Month', icon: '📅' },
    { value: 'last_month', label: 'Last Month', icon: '📆' },
    { value: 'year', label: 'This Year', icon: '🗓️' },
    { value: 'custom', label: 'Custom Range', icon: '🎯' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Filter Options */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterTypeChange(option.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-all duration-200 ${
                tempFilters.type === option.value
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {showCustomDateRange && (
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempFilters.startDate || ''}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempFilters.endDate || ''}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={applyCustomFilters}
                  disabled={!tempFilters.startDate || !tempFilters.endDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearCustomDates}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Display */}
        {filters.type && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Active Filter: {filterOptions.find(opt => opt.value === filters.type)?.label}
                {filters.type === 'custom' && filters.startDate && filters.endDate && (
                  <span className="ml-2">
                    ({filters.startDate} to {filters.endDate})
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
