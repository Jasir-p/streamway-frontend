import React from 'react';

const Pagination = ({ 
  currentCount, 
  totalCount, 
  hasNext, 
  hasPrevious, 
  onNext, 
  onPrevious 
}) => {
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <div>
        Showing <span className="font-medium">{currentCount}</span> of{' '}
        <span className="font-medium">{totalCount}</span> contacts
      </div>
      <div className="flex items-center space-x-2">
        <button
          className={`px-3 py-1 border rounded-md disabled:opacity-50 ${
            hasPrevious ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300'
          }`}
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          Previous
        </button>
        <button
          className={`px-3 py-1 border rounded-md ${
            hasNext ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300'
          }`}
          onClick={onNext}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;