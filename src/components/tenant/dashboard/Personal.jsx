import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, Edit, Mail, Phone, MapPin, Globe, Calendar, 
  Upload, Users, DollarSign, Camera, Save, X, 
  ChevronDown, Briefcase, Hash, Shield
} from 'lucide-react';
import DashboardLayout from './DashbordLayout';
import { useSelector,useDispatch } from 'react-redux';
import api from '../../../api';
import { useToast } from '../../common/ToastNotification';
import { updateProfile } from '../../../redux/slice/ProfileSlice';
import subdomainInterceptors from '../../../Intreceptors/getSubdomainInterceptors';




const Personal = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState(null);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.profile);
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [personalDetails, setPersonalDetails] = useState({});
  const dispatch = useDispatch();
  const userId = profile.id 
  console.log(userId)
  
  useEffect(() => {
    setPersonalDetails({ ...profile, role });
  }, [profile, role]);

  const handleInputChange = (field, value) => {
    setPersonalDetails({
      ...personalDetails,
      [field]: value
    });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
        setShowUploadOption(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleUploadOption = () => {
    if (isEditing) {
      setShowUploadOption(!showUploadOption);
    }
  };

  const saveChanges = async() => {
   
    try{
      setIsLoading(true)
      if (!personalDetails.name?.trim()){
        showWarning('Please enter your name')
        return
      }
      if (!personalDetails.email?.trim()){
        showWarning('Please enter your email')
        return
        }
        const profileData ={
          ...personalDetails,
        }
        
        
        const response = await subdomainInterceptors.put("/profile_update/", { ...profileData, userId,role })
        
        if (response.status === 200) {
          dispatch(updateProfile(profileData))
          showSuccess("profile updated successfully");
          setIsEditing(false)
          setShowUploadOption(false)
        }
        
    }catch (error){
      const errorMessage = error.response?.data?.message || "failed to update profile"
      showWarning(errorMessage)
      }finally{
        setIsLoading(false)
      }
    
  };

  const cancelChanges = () => {
    // Revert any unsaved changes if needed
    setPersonalDetails({ ...profile, role });
    setIsEditing(false);
    setShowUploadOption(false);
    showInfo('Changes discarded');
  };

  const renderDetailRow = (icon, label, field, type = "text", isEditable = true) => (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0 pt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {isEditing && isEditable ? (
          <input
            type={type}
            value={personalDetails[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        ) : (
          <p className="text-sm font-medium text-gray-800 mt-1">{personalDetails[field] || 'Not specified'}</p>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Profile Picture/Logo */}
              <div className="relative">
                <div 
                  className={`w-28 h-28 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}
                  onClick={isEditing ? toggleUploadOption : undefined}
                >
                  {logo ? (
                    <img src={logo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-14 h-14 text-blue-500" />
                  )}
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity hover:bg-opacity-40">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Upload Option Popup */}
                {showUploadOption && isEditing && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 z-10 w-48">
                    <button 
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload new image</span>
                    </button>
                    {logo && (
                      <button 
                        onClick={() => {setLogo(null); setShowUploadOption(false);}}
                        className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove image</span>
                      </button>
                    )}
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              
              {/* Personal Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={personalDetails.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full text-2xl font-bold text-gray-800 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Your Name"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-800">{personalDetails.name || 'Your Name'}</h2>
                    )}
                    
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Shield className="w-4 h-4 mr-1" />
                        {personalDetails.role || 'User'}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                    aria-label={isEditing ? "Save changes" : "Edit personal information"}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Section */}
          <div className="p-6 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Details
              </h3>
              
              {isEditing && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  Edit Mode
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                {renderDetailRow(
                  <Building className="w-5 h-5 text-blue-500" />, 
                  'Full Name', 
                  'name'
                )}
                
                {renderDetailRow(
                  <Mail className="w-5 h-5 text-green-500" />, 
                  'Email Address', 
                  'email',
                  'email'
                )}
                
                {renderDetailRow(
                  <Phone className="w-5 h-5 text-purple-500" />, 
                  'Phone Number', 
                  'phone',
                  'tel'
                )}
              </div>
              
              <div>
                {renderDetailRow(
                  <Shield className="w-5 h-5 text-indigo-500" />, 
                  'Role', 
                  'role',
                  'text',
                  false
                )}
                
                {renderDetailRow(
                  <Calendar className="w-5 h-5 text-teal-500" />, 
                  'Joined Date', 
                  'joined_date',
                  "text",
                  false
                )}
                
                {renderDetailRow(
                  <Users className="w-5 h-5 text-amber-500" />, 
                  'Team Members', 
                  'employees'
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
              <button 
                onClick={cancelChanges}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button 
                onClick={saveChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Personal;