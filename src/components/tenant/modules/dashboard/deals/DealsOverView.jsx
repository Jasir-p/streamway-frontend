import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  FileText, 
  Plus,
  Clock,
  DollarSign,
  Tag,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const DealViewUI = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Sample deal data
  const deal = {
    id: 1,
    title: "Website Revamp for ABC Corp",
    stage: "Negotiation",
    status: "In Progress",
    amount: "2,00,000",
    expectedCloseDate: "25 June 2025",
    priority: "High",
    source: "Website",
    notes: "Client is very interested in the proposal. They want to see additional features for mobile responsiveness. Follow up scheduled for next week.\n\nKey requirements:\n- Modern design\n- Mobile-first approach\n- SEO optimization\n- CMS integration",
    account: {
      name: "ABC Corporation",
      type: "B2B", // B2B or B2C
      contact: {
        name: "John Smith",
        email: "john.smith@abccorp.com",
        phone: "+91 98765 43210"
      }
    },
    assignedTo: "Sarah Johnson",
    createdDate: "2025-06-01",
    lastActivity: "2025-06-08"
  };

  const activities = [
    { id: 1, type: "call", description: "Initial discovery call completed", date: "2025-06-08", time: "2:30 PM" },
    { id: 2, type: "email", description: "Sent proposal and pricing", date: "2025-06-07", time: "11:15 AM" },
    { id: 3, type: "meeting", description: "Requirements gathering session", date: "2025-06-05", time: "3:00 PM" },
    { id: 4, type: "task", description: "Deal created and assigned", date: "2025-06-01", time: "9:00 AM" }
  ];

  const getStatusColor = (status) => {
    const colors = {
      "New": "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      "Won": "bg-green-100 text-green-800",
      "Lost": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "New": <AlertCircle className="w-4 h-4" />,
      "In Progress": <Clock className="w-4 h-4" />,
      "Won": <CheckCircle className="w-4 h-4" />,
      "Lost": <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-green-100 text-green-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getSourceColor = (source) => {
    const colors = {
      "Website": "bg-blue-100 text-blue-800",
      "Referral": "bg-purple-100 text-purple-800",
      "Call": "bg-green-100 text-green-800",
      "Event": "bg-orange-100 text-orange-800"
    };
    return colors[source] || "bg-gray-100 text-gray-800";
  };

  const handleDeleteDeal = () => {
    setShowDeleteConfirm(false);
    // Handle delete logic here
    alert('Deal deleted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Stage: <strong className="text-gray-900">{deal.stage}</strong>
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Expected Close: <strong className="text-gray-900">{deal.expectedCloseDate}</strong>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 mb-2">₹{deal.amount}</div>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.status)}`}>
              {getStatusIcon(deal.status)}
              {deal.status}
            </div>
          </div>
        </div>
      </div>

      {/* Account & Contact Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Account & Contact Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Account Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{deal.account.name}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {deal.account.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Assigned to: <strong>{deal.assignedTo}</strong></span>
              </div>
            </div>
          </div>

          {deal.account.type === "B2B" && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{deal.account.contact.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{deal.account.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{deal.account.contact.phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deal Description / Notes */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Notes & Description
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {deal.notes || 'No notes added yet.'}
          </p>
        </div>
      </div>

      {/* Tags & Meta */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Priority & Source
        </h2>
        <div className="flex flex-wrap gap-3">
          <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${getPriorityColor(deal.priority)}`}>
            <AlertCircle className="w-4 h-4" />
            Priority: {deal.priority}
          </div>
          <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${getSourceColor(deal.source)}`}>
            <Users className="w-4 h-4" />
            Source: {deal.source}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {activity.type === 'call' && <Phone className="w-4 h-4 text-blue-600" />}
                {activity.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                {activity.type === 'meeting' && <Users className="w-4 h-4 text-blue-600" />}
                {activity.type === 'task' && <CheckCircle className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.date} at {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit Deal
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Deal
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <DollarSign className="w-4 h-4" />
            Convert to Sale
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Follow-up
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Deal</h3>
                <p className="text-gray-600">Are you sure you want to delete this deal?</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All deal data and associated activities will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDeal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealViewUI;