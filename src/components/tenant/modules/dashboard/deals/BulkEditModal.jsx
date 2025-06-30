import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';

const BulkEditModal = ({ isOpen, onClose, selectedDeals, onBulkUpdate, deals }) => {
  const [bulkChanges, setBulkChanges] = useState({
    stage: '',
    status: '',
    priority: '',
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);

  const filterOptions = {
    stage: ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"],
    status: ["new", "in_progress", "won", "lost"],
    priority: ["high", "medium", "low"],
    assignedTo: [] // This would be populated from your employees list
  };

  const formatOption = (option) => {
    return option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInputChange = (field, value) => {
    setBulkChanges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkUpdate = async () => {
    setLoading(true);
    try {
      // Filter out empty values
      const updates = Object.fromEntries(
        Object.entries(bulkChanges).filter(([_, value]) => value !== '')
      );
      
      if (Object.keys(updates).length === 0) {
        alert('Please select at least one field to update');
        setLoading(false);
        return;
      }

      await onBulkUpdate(selectedDeals, updates);
      onClose();
      setBulkChanges({ stage: '', status: '', priority: '', assignedTo: '' });
    } catch (error) {
      console.error('Bulk update failed:', error);
      alert('Failed to update deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDealsData = deals.filter(deal => selectedDeals.includes(deal.deal_id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Bulk Edit Deals ({selectedDeals.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Warning</p>
                <p>Changes will be applied to all {selectedDeals.length} selected deals. This action cannot be undone.</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                value={bulkChanges.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No change</option>
                {filterOptions.stage.map(option => (
                  <option key={option} value={option}>
                    {formatOption(option)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={bulkChanges.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No change</option>
                {filterOptions.status.map(option => (
                  <option key={option} value={option}>
                    {formatOption(option)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={bulkChanges.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No change</option>
                {filterOptions.priority.map(option => (
                  <option key={option} value={option}>
                    {formatOption(option)}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To (if you have employees data) */}
            {filterOptions.assignedTo.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  value={bulkChanges.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No change</option>
                  {filterOptions.assignedTo.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Selected Deals Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Deals:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedDealsData.slice(0, 10).map(deal => (
                <div key={deal.deal_id} className="text-xs text-gray-600">
                  {deal.title} - {deal.account_id?.name || 'No Account'}
                </div>
              ))}
              {selectedDealsData.length > 10 && (
                <div className="text-xs text-gray-500 italic">
                  ...and {selectedDealsData.length - 10} more
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkUpdate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update {selectedDeals.length} Deal{selectedDeals.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;