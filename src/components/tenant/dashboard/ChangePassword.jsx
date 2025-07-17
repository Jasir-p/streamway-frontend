import React, { useState } from 'react';
import { KeyRound, EyeOff, Eye, Lock, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DashboardLayout from './DashbordLayout';
import { useToast } from '../../common/ToastNotification';
import api from '../../../api';
import { useSelector } from 'react-redux';
import axios from 'axios';
import subdomainInterceptors from '../../../Intreceptors/getSubdomainInterceptors';




const passwordSet = async(data)=>{
    const response = await subdomainInterceptors.post('password/', data);
    return response .data;
}


const passwordVerify = async(data)=>{
    const response = await api.post('verfiy_password/', data);
    
    return response .data;
}

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const email = useSelector((state)=>state.profile.email)
  
  const {showError,showSuccess} = useToast()
  
  // Password form
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword,
    reset:resetPasswordForm,
    watch,
    setError, 
    formState: { errors: passwordErrors } 
  } = useForm({
    defaultValues: {
      oldPassword:'',
      newPassword: '',
      confirmPassword: '',
    }
  });

  // OTP form
  const { 
    register: registerOtp, 
    handleSubmit: handleSubmitOtp,
    reset: resetOtpForm,
    setError:setOtpError,
    formState: { errors: otpErrors } 
  } = useForm();
 

 const onSubmitPassword = async (data) => {
  const requestData = { ...data, email };

  try {
    const response = await passwordSet(requestData);
    setIsOtpStep(true);
    resetPasswordForm();
  } catch (error) {
    const errData = error.response?.data;

    if (errData?.oldPassword) {
      setError("oldPassword", {
        type: "manual",
        message: Array.isArray(errData.oldPassword) ? errData.oldPassword[0] : errData.oldPassword,
      });
    } else if (errData?.old_password) {
      setError("oldPassword", {
        type: "manual",
        message: Array.isArray(errData.old_password) ? errData.old_password[0] : errData.old_password,
      });
    } else if (errData?.message) {
      showError(errData.message);
    } else if (errData?.error) {
      showError(errData.error);
    } else if (errData?.detail) {
      showError(errData.detail);
    } else {
      showError("Password change failed. Please try again.");
    }
  }
};


  const onSubmitOtp =async (data) => {


    const requestData = { otp:data.otp, 
        email:email };
    
    try {
    const response = await passwordVerify(requestData);

    setIsOtpStep(false);
    resetOtpForm();
    resetPasswordForm();
    showSuccess('Password changed successfully!');
  } catch (error) {
    console.error('OTP verification error:', error); // Add logging
    
    const errData = error.response?.data;
    
    if (errData?.otp) {
      setOtpError("otp", {
        type: "manual",
        message: Array.isArray(errData.otp) ? errData.otp[0] : errData.otp,
      });
    } else if (errData?.message) {
      showError(errData.message);
    } else if (errData?.error) {
      showError(errData.error);
    } else {
      showError("OTP verification failed. Please try again.");
    }
  }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {!isOtpStep ? (
            <div className="flex flex-col md:flex-row">
              {/* Left side - Instructions */}
              <div className="w-full md:w-1/2 bg-blue-600 text-white p-8">
                <div className="mb-8">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full inline-block mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Password Security</h4>
                  <p className="text-blue-100">
                    Strong passwords help protect your account from unauthorized access.
                    Change your password regularly to keep your account secure.
                  </p>
                </div>
                
                <div className="space-y-6 text-blue-100">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <p>Enter your current password</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <p>Create a strong new password with at least 8 characters, including numbers and special characters</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <p>Confirm with OTP verification sent to your email</p>
                  </div>
                </div>
              </div>
              
              {/* Right side - Password form */}
              <div className="w-full md:w-1/2 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Update Your Password</h3>
                
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  <div className="space-y-6">
                    
                    
                <div>
                  <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Old Password
                        </label>
                        <div className="relative">
                        <input
                            id="oldPassword"
                            {...registerPassword("oldPassword", { 
                            required: "Old password is required",
              
                            })}
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        </div>
                        {passwordErrors.oldPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.oldPassword.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                        </label>
                        <div className="relative">
                        <input
                            id="newPassword"
                            {...registerPassword("newPassword", { 
                            required: "New password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters"},
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                                message: 'Password must include uppercase, lowercase, number, and special character'
                            }
                            })}
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        </div>
                        {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                        </label>
                        <div className="relative">
                        <input
                            id="confirmPassword"
                            {...registerPassword("confirmPassword", { 
                            required: "Please confirm your new password",
                            validate: (value) => value === watch("newPassword") || 'Passwords do not match'
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                        )}
                    </div>
                    </div>
                </div>
                  
                  <div className="mt-8">
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Continue to Verification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* Left side - OTP Instructions */}
              <div className="w-full md:w-1/2 bg-green-600 text-white p-8">
                <div className="mb-8">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full inline-block mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Verification</h4>
                  <p className="text-green-100">
                    We've sent a verification code to your registered email address. 
                    Please enter the code to complete your password change.
                  </p>
                </div>
                
                <div className="space-y-6 text-green-100">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p>Check your email for the 6-digit code</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p>Enter the code to confirm your identity</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <p>Code expires in 5 minutes</p>
                  </div>
                </div>
              </div>
              
              {/* Right side - OTP form */}
              <div className="w-full md:w-1/2 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Enter Verification Code</h3>
                
                <p className="text-gray-600 mb-6">
                  Enter the 6-digit verification code sent to your email address
                </p>
                
                
                <form onSubmit={handleSubmitOtp(onSubmitOtp)}>
                  <div className="flex justify-between mb-8">
                  <input
                    type="text"
                    id="otp"
                    {...registerOtp("otp", {
                      required: "Please enter the verification code",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Please enter a valid 6-digit code"
                      }
                    })}
                       
                        maxLength="6"
                        className="w-full pl-10 pr-3 py-2 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    
                    </div>
                  
                  <div className="space-y-4">
                    <button 
                      type="submit"
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Verify and Change Password
                    </button>
                    
                    <button 
                      type="button"
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      onClick={() => setIsOtpStep(false)}
                    >
                      Back to Password Form
                    </button>
                    
                    <div className="text-center mt-4">
                      <button 
                        type="button"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;