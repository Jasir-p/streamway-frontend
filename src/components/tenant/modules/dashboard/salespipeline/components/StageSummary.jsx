import React from 'react';

const StageSummary = ({ activeTab, currentData, leadStages, dealStages }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  console.log(currentData);
  

  const stages = activeTab === 'leads' ? leadStages : dealStages;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((status) => {
           const stageItems = currentData.filter(item => 
            activeTab === 'deals' ? item.stage === status : item.status === status
          );
          const stageValue = activeTab === 'deals' ? stageItems.reduce((sum, item) => sum + item.amount, 0) : 0;
          
          return (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {status.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-xl font-bold text-gray-900">{stageItems.length}</p>
              {activeTab === 'deals' && (
                <p className="text-sm text-gray-500">{formatCurrency(stageValue)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageSummary;