import React, { useState, useRef } from 'react'
import { Bell, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileModal from '../tenant/dashboard/ProfileIcon';
import NotificationsModal from '../tenant/modules/dashboard/notifications/Notifications';
import userProfile from '../../assets/user-profile.webp';

const Navbar = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const name = useSelector((state) => state.profile.name);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const profileRef = useRef(null);
  const [UnreadCount, setUnreadCount] = useState(0);

  const subdomain = localStorage.getItem("subdomain") || "";

  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };



  return (
    <div className="flex justify-center py-4 bg-white">
      <header className="bg-blue-200 max-w-3xl w-full rounded-2xl shadow-md">
        <div className="flex items-center justify-between px-6 py-3">
          
          {/* 👋 Personalized Greeting */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-2">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                {getGreeting()}, {name}!
              </h2>
              <p className="text-blue-100 text-sm">
                Welcome back to your dashboard
              </p>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* 🔔 Notifications */}
            <button 
              className="p-2 hover:bg-white/10 rounded-full relative transition-colors"
              onClick={() => setBellOpen(true)}
            >
              <Bell className="h-5 w-5 text-white" />
              {UnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {UnreadCount > 99 ? '99+' : UnreadCount}
                </span>
              )}
            </button>

            <NotificationsModal
              isOpen={bellOpen}
              onClose={() => setBellOpen(false)}
              setCount={setUnreadCount}
            />

            {role === "owner" && (
              <button
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => navigate(`/${subdomain}/setting/genaral`)}
              >
                <Settings className="h-5 w-5 text-white" />
              </button>
            )}

            {/* Divider */}
            <div className="h-8 w-px bg-white/20" />

            {/* 🧑 Profile */}
            <img
              src={userProfile}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white/30 cursor-pointer hover:border-white/50 transition-colors"
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