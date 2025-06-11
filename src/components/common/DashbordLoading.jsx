import React from 'react'
import DashboardLayout from '../tenant/dashboard/DashbordLayout'
import { RefreshCw } from 'lucide-react'


const DashbordLoading = () => {
  
   return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-600">Loading...</span>
          </div>
        </div>
      </DashboardLayout>

  )
}

export default DashbordLoading
