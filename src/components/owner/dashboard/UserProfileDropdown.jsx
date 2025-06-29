import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleProfile = () => {
    console.log('Navigate to profile');
    setIsOpen(false);

  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsOpen(false);

  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
   

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {/* Profile Option */}
            <button
              onClick={handleProfile}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
            >
              <Settings className="w-4 h-4 mr-3" />
              Profile
            </button>
            
            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>
            
            {/* Logout Option */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}