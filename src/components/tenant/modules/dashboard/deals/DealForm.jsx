import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Calendar, User, Building, Target, TrendingUp, X, Edit } from 'lucide-react';
import { addDeal, editDeal } from '../../../../../redux/slice/DealSlice';
import { useDispatch } from 'react-redux';
import { AccountDropdown } from '../meetings/components/MeetingDropDown';

export default function DealModal({ 
  isOpen, 
  onClose, 
  userId, 
  role, 
  onSuccess, 
  dealData = null, // Pass existing deal data for editing
  isEditing = false // Flag to determine if we're editing or adding
}) {
  
  const [formData, setFormData] = useState({
    account_id: '',
    title: '',
    amount: '',
    status: 'new',
    stage: '',
    expected_close_date: '',
    owner: '',
    created_by: role !== 'owner' ? userId : null,
    priority: '',
    source: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccountDropDownOpen, setIsAccountDropDownOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const dispatch = useDispatch();

  const statusChoices = [
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' }
  ];

  const priorityChoices = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const stageChoices = [
    { value: 'discovery', label: 'Discovery' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' }
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && dealData) {
      setFormData({
        account_id: dealData.account_id || '',
        title: dealData.title || '',
        amount: dealData.amount || '',
        status: dealData.status || 'new',
        stage: dealData.stage || '',
        expected_close_date: dealData.expected_close_date || '',
        owner: dealData.owner || '',
        created_by: dealData.created_by || (role !== 'owner' ? userId : null),
        priority: dealData.priority || '',
        source: dealData.source || ''
      });

      // Set selected account if available
      if (dealData.account) {
        setSelectedAccount(dealData.account);
      }
    } else {
      // Reset form for adding new deal
      resetForm();
    }
  }, [isEditing, dealData, userId, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setFormData(prev => ({
      ...prev,
      account_id: account.id,
      owner: account.assigned_to?.id || ''
    }));
    setIsAccountDropDownOpen(false);
    
    // Clear account error if exists
    if (errors.account_id) {
      setErrors(prev => ({
        ...prev,
        account_id: ''
      }));
    }
  };

  const handleAccountDropdownToggle = () => {
    setIsAccountDropDownOpen(!isAccountDropDownOpen);
  };

  const handleAccountDropdownClose = () => {
    setIsAccountDropDownOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.account_id) {
      newErrors.account_id = 'Account is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.expected_close_date) {
      newErrors.expected_close_date = 'Expected close date is required';
    }
 
    // Check if expected close date is in the future (only for new deals)
    if (formData.expected_close_date && !isEditing) {
      const selectedDate = new Date(formData.expected_close_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.expected_close_date = 'Expected close date must be today or in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        // Update existing deal
        await dispatch(editDeal({ 
          deal_id: dealData.deal_id, 
          ...formData 
        }));
      } else {
        // Add new deal
        await dispatch(addDeal(formData));
      }
      
      resetForm();
      onClose();
      onSuccess();
      
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      account_id: '',
      title: '',
      amount: '',
      status: 'new',
      stage: '',
      expected_close_date: '',
      owner: '',
      created_by: role !== 'owner' ? userId : null,
      priority: '',
      source: ''
    });
    setSelectedAccount(null);
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      if (!isEditing) {
        resetForm();
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r  text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    {isEditing ? <Edit className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {isEditing ? 'Edit Deal' : 'Add New Deal'}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {isEditing ? 'Update deal information' : 'Create a new sales opportunity'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Account Selection with Dropdown */}
                <div className="space-y-2 relative">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Building className="w-4 h-4 mr-2 text-blue-500" />
                    Account <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleAccountDropdownToggle}
                      className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-left flex items-center justify-between ${
                        errors.account_id ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <span className={selectedAccount ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedAccount ? selectedAccount.name : 'Select Account'}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isAccountDropDownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AccountDropdown
                      isOpen={isAccountDropDownOpen}
                      onSelect={handleAccountSelect}
                      onClose={handleAccountDropdownClose}
                      selectedAccount={selectedAccount}
                      placeholder="Select account"
                      className="mt-1"
                    />
                  </div>
                  {errors.account_id && (
                    <p className="text-red-500 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.account_id}
                    </p>
                  )}
                </div>

                {/* Deal Title */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    Deal Title <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter deal title"
                    className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      errors.title ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
                    Amount <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      errors.amount ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Expected Close Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    Expected Close Date <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="expected_close_date"
                    value={formData.expected_close_date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm ${
                      errors.expected_close_date ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.expected_close_date && (
                    <p className="text-red-500 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.expected_close_date}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    {statusChoices.map(choice => (
                      <option key={choice.value} value={choice.value}>{choice.label}</option>
                    ))}
                  </select>
                </div>

                {/* Stage */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Stage</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="">Select Stage</option>
                    {stageChoices.map(choice => (
                      <option key={choice.value} value={choice.value}>{choice.label}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="">Select Priority</option>
                    {priorityChoices.map(choice => (
                      <option key={choice.value} value={choice.value}>{choice.label}</option>
                    ))}
                  </select>
                </div>

                {/* Source */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="e.g., Website, Referral, Cold Call, Trade Show"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-all duration-200 disabled:opacity-50 text-sm"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEditing ? 'Update Deal' : 'Create Deal'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}