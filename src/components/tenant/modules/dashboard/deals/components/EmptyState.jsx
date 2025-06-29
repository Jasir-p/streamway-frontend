import React from 'react';
import { Search, Plus, X } from 'lucide-react';

export const EmptyState = ({ hasFilters, onClearFilters, onCreateDeal }) => (
  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
    <p className="text-gray-600 mb-4">
      {hasFilters 
        ? "Try adjusting your search or filters to find what you're looking for."
        : "Get started by creating your first deal."}
    </p>
    {hasFilters ? (
      <button 
        onClick={onClearFilters} 
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
        Clear Filters
      </button>
    ) : (
      <button 
        onClick={onCreateDeal}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create First Deal
      </button>
    )}
  </div>
);
