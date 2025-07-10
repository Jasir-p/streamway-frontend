import React from 'react';
import { Mail, Phone, Star, StarOff, Edit, MoreHorizontal } from 'lucide-react';
import userprofile from "../../../../../../assets/user-profile.webp";
import { updateContact } from '../../../../../../redux/slice/contactSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ContactRow = ({ 
  contact, 
  isSelected, 
  onToggleSelect, 
  onToggleFavorite, 
  showActionDropdown, 
  onShowActionDropdown,
  onChange,
  onEdit // New prop for handling edit
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subdomain = localStorage.getItem("subdomain")

  const handleStatusChange = (contact) => {
    const data = {
      id: contact.id,
      status: contact.status === 'active' ? 'inactive' : 'active'
    };
    dispatch(updateContact(data));
    onChange();
    onShowActionDropdown(null);
  };

  const handleScheduleClick = () => {
    navigate(`/${subdomain}/dashboard/activity/meetings`);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit.openModal(contact);
    }
    onShowActionDropdown(null); // Close dropdown if open
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded"
            checked={isSelected}
            onChange={() => onToggleSelect(contact.id)}
          />
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium">
            {contact?.name? contact?.name?.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
          </div>
          <div className="font-medium text-gray-900 flex items-center">
            {contact?.name}
            {contact?.is_primary_contact && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Primary
              </span>
            )}
            
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Mail size={14} className="mr-2 text-gray-400" />
            {contact?.email}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone size={14} className="mr-2 text-gray-400" />
            {contact?.phone_number}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          contact.status === 'active' ? 'bg-green-100 text-green-800' :
          contact.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          <span className={`w-2 h-2 mr-1 rounded-full ${
            contact.status === 'active' ? 'bg-green-500' : 'bg-gray-500' 
          }`}></span>
          {contact?.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <img
              src={userprofile}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm font-medium text-gray-900">
              {contact?.account_id?.assigned_to?.name}
              <div className="text-xs text-gray-500">
                {contact?.account_id?.assigned_to?.role?.name}
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              src={userprofile}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm font-medium text-gray-900">
              {contact?.account_id?.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {contact.lastContact}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <div className="flex items-center justify-end space-x-2">
          <button 
            className="p-1 text-indigo-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
            onClick={handleEditClick}
            title="Edit Contact"
          >
            <Edit size={18} />
          </button>
          
          <div className="relative">
            <button 
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              onClick={() => onShowActionDropdown(showActionDropdown === contact.id ? null : contact.id)}
            >
              <MoreHorizontal size={18} />
            </button>

            {showActionDropdown === contact.id && (
              <div className="absolute right-0 mt-2 z-20 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                <button 
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    contact.status === 'active' ? 'text-red-600' : 'text-green-600'
                  }`} 
                  onClick={() => handleStatusChange(contact)}
                >
                  {contact.status === 'active' ? 'Inactive' : 'Active'}
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={handleScheduleClick}
                >
                  Schedule Meeting
                </button>
                
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={handleEditClick}
                >
                  Edit Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;