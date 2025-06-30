import React from 'react';

export const Pagination = ({ 
  hasNext, 
  hasPrevious, 
  onNext, 
  onPrevious
}) => (
  <div className="bg-white rounded-lg shadow-sm  p-4 mt-6">
    <div className="flex items-center justify-center gap-2">
      <button 
        onClick={onPrevious} 
        disabled={!hasPrevious} 
        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
          hasPrevious 
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
            : 'border-gray-300 text-gray-400 cursor-not-allowed'
        }`}
      >
        Previous
      </button>
      <button 
        onClick={onNext} 
        disabled={!hasNext} 
        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
          hasNext 
            ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
            : 'border-gray-300 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  </div>
);