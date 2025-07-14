import React, { useEffect, useState } from 'react';
import { Lock, ArrowRight, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../common/ToastNotification';
import api from '../../../api';
import defaultInterceptor from "../../../Intreceptors/defaultInterceptors";

function OtpCheck() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const [counter, setCounter] = useState(120);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false); // Added missing state
  const [verificationStatus, setVerificationStatus] = useState(null);
  const tenantEmail = useSelector((state) => state.tenantEmail.email);
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data) => {
    setIsVerifying(true);
    try {
      const requestData = {
        "otp": data.otp,
        "email": tenantEmail
      };
      
      const response = await defaultInterceptor.post('/register/', requestData);
      
      
      
      if (response.status === 201) {
        setVerificationStatus(response.data.message);
        clearErrors('otp');
        showSuccess("Account verified successfully!");
        navigate('/login');
      }  else {
  
      setError('otp', {
        type: 'manual',
        message: 'Invalid OTP. Please try again.'
      });
      setVerificationStatus('error');
      showError("Invalid OTP. Please try again.");
    }
    } catch (error) {
    
      
      const errorMessage = error.response?.data?.otp?.[0] ||  error.response?.data?.error ||
       error.response?.data?.message || 'An error occurred. Please try again.';
      setError('otp', {
      type: 'manual',
      message: errorMessage
    });
    showError(errorMessage);
    setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    clearErrors('otp');
    setVerificationStatus(null);
    
    try {
      const data = { "email": tenantEmail };
      const response = await defaultInterceptor.post('/resend-otp/', data);
      
      if (response.status === 200) {
        setCounter(120);
        showSuccess("OTP has been resent successfully!");
      } else {
        setError('otp', {
          type: 'manual',
          message: 'Failed to resend OTP.'
        });
        showError("Failed to resend OTP.");
      }
    } catch (error) {
      setError('otp', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to resend OTP.'
      });
      showError(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Header */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">StreamWay</span>
        </div>
      </nav>

      {/* OTP Verification Form */}
      <div className="container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Verify Your Account</h2>
              <p className="mt-2 text-gray-600">
                We've sent a verification code to <span className="font-medium">{tenantEmail || "your email"}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter Verification Code
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otp"
                    {...register("otp", {
                      required: "Please enter the verification code",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Please enter a valid 6-digit code"
                      }
                    })}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.otp ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                </div>
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center ${
                    isVerifying ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isVerifying ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Verify Code <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>

                {counter > 0 && (
                  <p className="text-center text-sm text-gray-600">
                    Code expires in <span className="font-medium">{formatTime(counter)}</span>
                  </p>
                )}
              </div>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={counter > 0 || isResending}
                  className={`text-blue-600 hover:text-blue-500 font-medium ${
                    counter > 0 || isResending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isResending ? 'Sending...' : 'Resend'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpCheck;