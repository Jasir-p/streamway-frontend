import React, { useState, useRef, useEffect } from 'react';
import { Mail, Tag, Briefcase, Share2, Archive, Trash2, Send, Move, X, ChevronDown, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getUser, AssignTo,deleteLeads } from '../../Intreceptors/LeadsApi';
import ConversionOptionsPopup from '../tenant/modules/dashboard/Leads/ConvertPopup';


const ToolbarButton = ({ Icon, label, onClick, isActive, disabled }) => (
  <div 
    className={`flex items-center space-x-1 cursor-pointer hover:bg-blue-600 px-2 py-1 rounded ${isActive ? 'bg-blue-600' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={disabled ? null : onClick}
    role="button"
    aria-label={label}
  >
    <Icon size={16} />
    <span className="text-sm">{label}</span>
    {label === "Assign to" && <ChevronDown size={14} />}
  </div>
);



export const UserDropdown = ({ isOpen, onSelect, onClose, selectedUser, placeholder, className = '' }) => {
  const dropdownRef = useRef(null);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUser(role === 'owner' ? role : profile.id);
        // Ensure response is an array
        setUsers(Array.isArray(response) ? response : response ? [response] : []);
      } catch (error) {
        
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, role, profile.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-12 mt-1 w-64 bg-white rounded-lg shadow-lg text-gray-800 z-50 py-2 ${className}`}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
        {placeholder || 'Select user to assign'}
      </div>
      
      {loading ? (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          Loading users...
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {users.length > 0 ? (
            users.map(user => (
              <div 
                key={user.id}
                className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50 font-medium' : ''
                }`}
                onClick={() => onSelect(user)}
              >
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  {user.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role?.name || 'User'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ExactToolbar = ({ count, leads, onUpdate, onClose,onUpdateComplete }) => {
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const assignButtonRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const profile = useSelector((state) => state.profile);
  const [isConversionPopup, setshowConversionPopup]=useState(false)
  
  const handleAction = (action) => {

    if (action==='Move to'){
      setshowConversionPopup(true)
    }

  };
  const handleDelete = async () => {
    
    const data = { lead_id: leads };
  
    try {
      const response = await deleteLeads(data);
  
      if (response?.status === 200 || response?.status === 201) {
        
  
        if (typeof onUpdate === 'function') {
          await onUpdate();
        }
  
        if (typeof onClose === 'function') {
          onClose();
        }
      } else {
        
      }
    } catch (error) {
      
    }
  };
  
 
    const handleConversionComplete = (success) => {
    setshowConversionPopup(false);
    onUpdateComplete(true); // 
  };
  
  const toggleAssignDropdown = () => {
    setAssignDropdownOpen(!assignDropdownOpen);
  };
  
  const handleSelectUser = async (user) => {
    
    setSelectedUser(user.id);
    setAssignDropdownOpen(false);
    

    if (leads && leads.length > 0 && user.id) {
      const hasConvertedLead = leads.some((lead) => lead.status === 'converted');
      if (hasConvertedLead) {
      alert("Assignment not allowed. One or more selected leads are already converted.");
      return;
    }
      try {
        setAssigning(true);
        const data = {
          "lead_id": leads,
          "employee": user.id,
          "granted_by": role === "owner" ? null : profile.id
        };
        
        const response = await AssignTo(data);
        
        if (response && (response.status === 200 || response.status === 201)) {
          

          if (typeof onUpdate === 'function') {
            await onUpdate();
          }

          if (typeof onClose === 'function') {
            onClose();
          }
        } else {
          
        }
      } catch (error) {
        
      } finally {
        setAssigning(false);
      }
    }
  };
  
return (
  <div className="bg-gray-100 text-black flex items-center h-14 px-4 rounded-lg w-auto relative shadow-md">
    <div className="bg-green-500 text-white px-3 py-1 rounded-md mr-4 flex items-center">
      <span className="mr-1 font-medium">{count}</span>
      <span className="text-sm">{count === 1 ? 'Lead' : 'Leads'}</span>
    </div>

    <div className="flex items-center space-x-2 flex-grow">
      {/* <ToolbarButton Icon={Mail} label="Mass Email" onClick={() => handleAction('Mass Email')} /> */}
      {/* <ToolbarButton Icon={Tag} label="Add to Tag" onClick={() => handleAction('Add to Tag')} /> */}
      <div ref={assignButtonRef} className="relative">
        <ToolbarButton 
          Icon={Send}  
          label={assigning ? "Assigning..." : "Assign to"} 
          onClick={toggleAssignDropdown} 
          isActive={assignDropdownOpen || assigning}
          disabled={assigning}
        />
        <UserDropdown 
          isOpen={assignDropdownOpen} 
          onSelect={handleSelectUser} 
          onClose={() => setAssignDropdownOpen(false)} 
        />
      </div>
      <ToolbarButton Icon={Move} label="Move to" onClick={() => handleAction('Move to')} />
      {isConversionPopup && (
        <ConversionOptionsPopup
          selectedLeads={leads}
          onClose={() => {
            setshowConversionPopup(false);
            onUpdateComplete(true);
          }}
          onConversionComplete={handleConversionComplete}
        />
      )}
      <ToolbarButton Icon={Trash2} label="Delete" onClick={handleDelete} />
    </div>

    {/* Close Button */}
    <div className="ml-4 cursor-pointer hover:bg-gray-200 p-1 rounded" onClick={onClose}>
      <X size={16} aria-label="Close Toolbar" />
    </div>
  </div>
);

};

export default ExactToolbar;