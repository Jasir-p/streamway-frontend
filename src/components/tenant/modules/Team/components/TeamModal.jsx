import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector,useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { fetchUsers } from '../../../../../redux/slice/UsersSlice';

const TeamModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  modalType, 
  loading, 
  team, 
  members,
  employees 
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  const getModalTitle = () => {
    switch (modalType) {
      case 'Member':
        return 'Add Member';
      case 'Team Lead':
        return 'Change Team Lead';
      case 'Remove Member':
        return 'Remove Member';
      default:
        return 'Team Action';
    }
  };

  const getFilteredUsers = () => {
    if (!employees) return [];

    return employees.filter(user => {
      if (modalType === 'Team Lead') {
        // For team lead, exclude current members
        return !members.some(member => member.id === user.id);
      } else {
        // For regular members, exclude team lead and current members
        const isTeamLead = team.team_lead && user.id === team?.team_lead.id;
        const isMember = members.some(member => member.id === user.id);
        return !isTeamLead && !isMember;
      }
    });
  };

  const getSubmitButtonText = () => {
    if (loading) {
      switch (modalType) {
        case 'Team Lead':
          return 'Updating...';
        case 'Remove Member':
          return 'Removing...';
        default:
          return 'Adding...';
      }
    }
    
    switch (modalType) {
      case 'Team Lead':
        return 'Update Team Lead';
      case 'Remove Member':
        return 'Remove Member';
      default:
        return 'Add Member';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md animate-fadeIn">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {getModalTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {modalType === 'Remove Member' ? (
          // Remove Member Confirmation
          <div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this member from the team?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmit({})}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </div>
        ) : (
          // Add Member / Change Team Lead Form
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select {modalType === 'Team Lead' ? 'Team Lead' : 'Member'}
              </label>
              <select
                {...register("employee", { 
                  required: `${modalType === 'Team Lead' ? 'Team Lead' : 'Member'} selection is required` 
                })}
                className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:outline-none transition-all"
                disabled={loading}
              >
                <option value="">
                  Select {modalType === 'Team Lead' ? 'Team Lead' : 'Member'}
                </option>
                {getFilteredUsers().map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role?.name || "No Role"})
                  </option>
                ))}
              </select>
              {errors.employee && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.employee.message}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {getSubmitButtonText()}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamModal;