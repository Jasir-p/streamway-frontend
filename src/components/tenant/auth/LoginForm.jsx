import React, { useState } from "react";
import { BarChart3, Mail, Lock, ArrowRight } from "lucide-react";
import logo from "../../../assets/logo.png";
import { useForm } from "react-hook-form";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode"; 
import defaultInterceptor from "../../../Intreceptors/defaultInterceptors";
import { useDispatch } from "react-redux";
import { setProfile } from "../../../redux/slice/ProfileSlice";
import { setUserRoleAndPermissions } from "../../../redux/slice/authrizeSlice";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  
  setIsLoading(true);
  setError("");

  try {
    const response = await defaultInterceptor.post(
      "/login/",
      {
        username: data.email,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { access_token, refresh_token } = response.data;

    if (access_token && refresh_token) {
      

      // Decode access token to get subdomain
      const decodedToken = jwtDecode(access_token);
      const subdomain = decodedToken.subdomain || decodedToken.tenant;

      if (!subdomain) {
        throw new Error("Subdomain not found in token.");
      }

      

      // ✅ Save tokens and subdomain to localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("subdomain", subdomain);
      const profile =response.data.profile
      dispatch(setProfile({
            id : profile.id,
            name: profile.owner_name,
            email: profile.email,
            phone: profile.contact, 
            role:decodedToken.role || 'User',
            company: profile.company || 'Unknown', 
            joined_date: profile.created_on,
          }));
          dispatch(setUserRoleAndPermissions({ 
            role: decodedToken.role, 
            permissions: decodedToken.permissions || [] 
          }));



      // ✅ Redirect to dashboard using subdomain as subfolder
      const redirectUrl = `/${subdomain}/dashboard`;
      

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
    } else {
      
      setError(response.data.message || "Login failed. Please try again.");
    }
  } catch (error) {
    

    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else if (error.response?.data?.detail) {
      setError(error.response.data.detail);
    } else {
      setError("Login failed. Please check your credentials and try again.");
    }
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img src={logo} className="h-16 w-34 center" alt="Logo" />
          </div>

          {/* Welcome Text */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account to continue managing your customer relationships.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your email"
                />
                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register("password", { required: "Password is required" })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your password"
                />
                {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

            <a
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgotpassword");
                  }}
                  href="/forgotpassword" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
            </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up for free
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
          alt="Office workspace with laptop and analytics"
        />
        {/* Overlay with testimonial */}
        <div className="absolute inset-0 bg-blue-600 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600/20" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <blockquote className="mt-6">
            <p className="text-xl font-medium text-white">
              "StreamWay has transformed how we manage our customer relationships."
            </p>
            <footer className="mt-6">
              <p className="text-base font-medium text-white">Nikhil Kilivayil</p>
              <p className="text-sm font-medium text-blue-100">CEO at BrotoType</p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;