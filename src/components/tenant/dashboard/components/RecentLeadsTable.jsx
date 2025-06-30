import React from 'react';
import { Eye, Edit } from 'lucide-react';

export const RecentLeadsTable = ({ leads }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'follow_up': return 'bg-emerald-100 text-emerald-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Leads</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Assigned</th>
              <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.length > 0 ? (
              leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-800">{lead.name}</td>
                  <td className="py-3 text-sm text-gray-600">{lead.email}</td>
                  <td className="py-3 text-sm text-gray-600">{lead.phone_number}</td>
                  <td className="py-3 text-sm text-gray-600">{lead.employee?.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-sm text-gray-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
