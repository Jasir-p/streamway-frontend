import React from 'react';
import SettingsLayout from './Settings';
import Navbar from '../../common/Navbar';
// import Company from '../../tenant/modules/Genaral/Company'
import Company from '../../tenant/modules/Genaral/Company';
import { 
  Building, Shield, Zap, CheckCircle, 
  Users, Briefcase, Settings, ExternalLink
} from 'lucide-react';

const Genaral = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <SettingsLayout>
      <Navbar />
        <div className="flex flex-col md:flex-row-reverse min-h-[calc(100vh-64px)]">
          {/* Right Section - now smaller in both width and height */}
          <div className="w-full md:w-1/4 lg:w-1/4 md:self-start bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-600 p-4 rounded-xl md:m-4">
            <div className="flex flex-col">
              {/* Top content - More compact */}
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white ml-2">Company Profile</h1>
                </div>
                <p className="text-blue-100 text-xs">
                  Your business identity information
                </p>
              </div>
              
              {/* Stats - More compact */}
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 transform transition-all hover:scale-105 cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-blue-100">Profile Completion</span>
                    <span className="text-white font-bold">75%</span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg transform transition-all hover:scale-105 cursor-pointer">
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-green-300 mr-2" />
                    <div>
                      <h3 className="text-white text-sm font-semibold">Verified Business</h3>
                      <p className="text-blue-100 text-xs">Officially verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Section - now wider */}
          <div className="w-full md:w-3/4 lg:w-3/4 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  Company Settings
                </h2>
                <p className="text-gray-600 mt-1">Manage your organization's information and appearance</p>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 flex flex-col items-center text-center transform transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Quick Setup</h3>
                <p className="text-sm text-gray-600">Complete your profile in minutes</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 flex flex-col items-center text-center transform transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Always Current</h3>
                <p className="text-sm text-gray-600">Keep your information up to date</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 flex flex-col items-center text-center transform transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Team Ready</h3>
                <p className="text-sm text-gray-600">All your team needs in one place</p>
              </div>
            </div>
            
            {/* Company Profile Card */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-blue-600" />
                  Company Profile
                </h3>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Essential</span>
              </div>
              <Company />
            </div>
            
            {/* Additional resources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-gray-600" />
                Resources & Help
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#" className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                      Company Setup Guide
                      <ExternalLink className="ml-1 h-3 w-3 text-gray-400" />
                    </h4>
                    <p className="text-xs text-gray-600">Learn how to configure your company profile effectively</p>
                  </div>
                </a>
                
                <a href="#" className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                      Support Center
                      <ExternalLink className="ml-1 h-3 w-3 text-gray-400" />
                    </h4>
                    <p className="text-xs text-gray-600">Get help with your company settings and profile</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </SettingsLayout>
    </div>
  );
};

export default Genaral;