import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus,
  Mail,
  UserPlus
} from 'lucide-react';

export const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
        <Plus className="h-4 w-4" />
        <span>Add Lead</span>
      </button>
      <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
        <Clock className="h-4 w-4" />
        <span>Add Task</span>
      </button>
      <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm">
        <Mail className="h-4 w-4" />
        <span>Send Email</span>
      </button>
      <button className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm">
        <UserPlus className="h-4 w-4" />
        <span>Add Contact</span>
      </button>
    </div>
  </div>
);