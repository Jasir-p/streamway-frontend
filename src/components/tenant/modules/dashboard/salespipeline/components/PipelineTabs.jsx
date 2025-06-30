import React from 'react';
import { Users, DollarSign } from 'lucide-react';

const PipelineTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('leads')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'leads'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Lead Pipeline
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'deals'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Deal Pipeline
        </button>
      </nav>
    </div>
  );
};

export default PipelineTabs;