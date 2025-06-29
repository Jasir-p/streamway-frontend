import { useRef,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../../../../Intreceptors/LeadsApi";




export const UserDropdownMeeting = ({ isOpen, onSelect, onClose, selectedUser, placeholder = 'Select meeting host', className = '',currentHost }) => {
  const dropdownRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUser(role === 'owner' ? role : profile.id);
        setUsers(Array.isArray(response) ? response : response ? [response] : []);
      } catch (error) {
        console.error('Error fetching users:', error);
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
  const filterUser = users?.filter(user => user.id !== currentHost);


  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`relative w-full max-w-xs bg-white rounded-lg shadow-lg text-gray-800 z-50 py-2 ${className}`}
    >
      <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
        {placeholder}
      </div>
      
      {loading ? (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          Loading users...
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          {filterUser.length > 0 ? (
            filterUser.map(user => (
              <div 
                key={user.id}
                className={`px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50 font-medium' : ''
                }`}
                onClick={() => {
                  onSelect(user);
                }}
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
