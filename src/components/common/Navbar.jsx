import React, { useState, useRef } from 'react'
import { Search, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileModal from '../tenant/dashboard/ProfileIcon';
import NotificationsModal from '../tenant/modules/dashboard/notifications/Notifications';
import userProfile from '../../assets/user-profile.webp';

const Navbar = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const profileRef = useRef(null);
  const [UnreadCount, setUnreadCount] = useState(0);

  const subdomain = localStorage.getItem("subdomain") || "";

  return (
    <div className="flex justify-center py-4 bg-white">
      <header className="bg-blue-200 max-w-3xl w-full rounded-2xl shadow-md">
        <div className="flex items-center justify-between px-6 py-3">
          
          {/* 🔍 Search Input */}
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 flex-1 max-w-md">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 bg-transparent outline-none w-full"
            />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* 🔔 Notifications */}
            <button 
              className="p-2 hover:bg-gray-700 rounded-full relative"
              onClick={() => setBellOpen(true)}
            >
              <Bell className="h-5 w-5 text-white" />
              {UnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {UnreadCount > 99 ? '99+' : UnreadCount}
                </span>
              )}
            </button>

            <NotificationsModal
              isOpen={bellOpen}
              onClose={() => setBellOpen(false)}
              setCount={setUnreadCount}
            />

            {/* ⚙️ Settings - only for owners */}
            {role === "owner" && (
              <button
                className="p-2 hover:bg-gray-700 rounded-full"
                onClick={() => navigate(`/${subdomain}/setting/genaral`)}
              >
                <Settings className="h-5 w-5 text-white" />
              </button>
            )}

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200" />
            <div className="h-8 w-px bg-gray-200" />

            {/* 🧑 Profile */}
            <img
              src={userProfile}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-gray-500 cursor-pointer"
              onClick={() => setProfileOpen(true)}
            />
          </div>

          {/* Profile Modal */}
          <ProfileModal 
            open={profileOpen}
            setOpen={setProfileOpen}
            anchorRef={profileRef}
          />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
