import { useState } from 'react';
import { useToast } from '../../common/ToastNotification';
import defaultInterceptor from '../../../Intreceptors/defaultInterceptors';
import { useNavigate } from 'react-router-dom';
import subdomainInterceptors from '../../../Intreceptors/getSubdomainInterceptors';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {showError,showSuccess}=useToast()
  const navigate = useNavigate();
  const isEmployee = localStorage.getItem("isEmployee") === "true";
  const subdomain = localStorage.getItem("subdomain");
  
const handleSubmit = async (e) => {
  e.preventDefault();


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showError("Please enter a valid email address");
    return;
  }

  setIsLoading(true);

try {
  if (isEmployee) {
    await subdomainInterceptors.post('forgot_password_employee/', { email });
  } else {
    await defaultInterceptor.post('/forgot_password/', { email });
  }

  setIsLoading(false);
  setIsSubmitted(true);
  localStorage.setItem("emailforgot", email);
  showSuccess("OTP has been sent to your email.");
  if (isEmployee) {

    navigate(`/${subdomain}/forgototpemployee`);
  } else {
    navigate('/forgototp');
  }
} catch (error) {
  setIsLoading(false);
  showError("Invalid user.");
  console.error("Forgot password error:", error);
}
}


  const resetForm = () => {
    setIsSubmitted(false);
    setEmail('');
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium ${
              isLoading || !email 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send Otp'
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={resetForm}
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}