import { useEffect, useRef, useState } from "react";
import { User, Lock, LogOut, Settings, Bell, HelpCircle } from "lucide-react";
import { Logout } from "../authentication/Authentication";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Personal from "./Personal";
import DashboardLayout from "./DashbordLayout";
// import ChangePassword from "../modules/Genaral/ChangePassword";
// import Notifications from "../modules/Genaral/Notifications";
// import HelpSupport from "../modules/Genaral/HelpSupport";

export default function ProfileDropdown({ open, setOpen }) {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("personal"); // To handle sections

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setShowModal(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center p-0.5">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32"
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-white">
                <h4 className="font-medium text-lg">John Doe</h4>
                <p className="text-sm text-white/80">john.doe@example.com</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                  <span className="text-xs text-white/90">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="py-2">
            <div className="px-3 py-2">
              <button
                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={() => handleSectionChange("personal")}
              >
                <User className="w-5 h-5 text-indigo-500" />
                <span className="font-medium">My Profile</span>
              </button>

              <button
                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={() => handleSectionChange("changePassword")}
              >
                <Lock className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Change Password</span>
              </button>

              <button
                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={() => handleSectionChange("notifications")}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Notifications</span>
              </button>

              <button
                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={() => handleSectionChange("helpSupport")}
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Help & Support</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-1 mx-3"></div>

            {/* Logout */}
            <div className="px-3 py-2">
              <button
                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50"
                onClick={() => Logout(role, navigate)}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              ✖
            </button>

            {/* Section Rendering */}
            {activeSection === "personal" && navigate('/dashboard/profile/personal')}
            {activeSection === "changePassword" && navigate('/dashboard/profile/password')}
            {activeSection === "notifications"}
            {activeSection === "helpSupport" }
          </div>
        </div>
      )}
    </div>
    
    
  );
}
