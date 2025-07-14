import React from 'react';
import { X } from 'lucide-react';

export const BulkActions = ({ 
  selectedCount, 
  onBulkEdit, 
  onBulkDelete, 
  onClearSelection,
  canDeleteDeal
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <div className="flex items-center justify-between">
      <span className="text-blue-700 font-medium">
        {selectedCount} deal{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <button 
          onClick={onBulkEdit}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Bulk Edit
        </button>
        {canDeleteDeal &&(
          <button 
          onClick={onBulkDelete}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete Selected
        </button>
        ) }
        
        <button 
          onClick={onClearSelection} 
          className="p-1 text-blue-600 hover:text-blue-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);