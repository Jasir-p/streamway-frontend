import React from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { FilterSelect } from './FilterSelect';
import { FILTER_OPTIONS } from './../constants/dealsConstants';

export const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showFilters,
  setShowFilters,
  employees,
  filters,
  setFilters,
  activeFiltersCount,
  clearFilters
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search deals, accounts, or assignees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="created_at">Created Date</option>
          <option value="title">Title</option>
          <option value="amount">Amount</option>
          <option value="expected_close_date">Close Date</option>
        </select>
        <button 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </button>
      </div>

      {/* Filters Toggle */}
      <button 
        onClick={() => setShowFilters(!showFilters)} 
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>

    {/* Filter Dropdowns */}
    {showFilters && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FilterSelect 
            value={filters.stage} 
            onChange={(e) => setFilters({...filters, stage: e.target.value})} 
            options={FILTER_OPTIONS.stage} 
            placeholder="All Stages" 
          />
          <FilterSelect 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})} 
            options={FILTER_OPTIONS.status} 
            placeholder="All Status" 
          />
          <FilterSelect 
            value={filters.priority} 
            onChange={(e) => setFilters({...filters, priority: e.target.value})} 
            options={FILTER_OPTIONS.priority} 
            placeholder="All Priorities" 
          />
          <FilterSelect 
            value={filters.amountRange} 
            onChange={(e) => setFilters({...filters, amountRange: e.target.value})} 
            options={FILTER_OPTIONS.amountRange} 
            placeholder="All Amounts" 
          />
          <FilterSelect 
            value={filters.assignedTo} 
            onChange={(e) => setFilters({...filters, assignedTo: e.target.value})} 
            options={
              employees.map(emp => ({ value: emp.id, label: emp.name }))
            } 
            placeholder="All Assignees" 
            isEmployeeFilter={true}
          />
        </div>
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={clearFilters} 
              className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);