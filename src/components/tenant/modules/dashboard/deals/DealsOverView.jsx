import React, { useEffect, useState } from 'react';
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
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useParams } from 'react-router-dom';
import { getDealOverView } from './api/DealsAPI';
import NotesDescription from './components/NotesDescription';
import { dealAddNote } from './api/DealsAPI';
import { useToast } from '../../../../common/ToastNotification';
import { dealsUtils } from './utils/dealsUtils';

const DealViewUI = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {deal_id} = useParams()
  const [deals, setDeal] = useState({});
  const {setShowSuccess, setShowError} = useToast()
  const [change, setChange] = useState(false);
  
  console.log(deals);

  const getStatusColor = (status) => {
    const colors = {
      "new": "bg-blue-100 text-blue-800",
      "in_progress": "bg-yellow-100 text-yellow-800",
      "won": "bg-green-100 text-green-800",
      "lost": "bg-red-100 text-red-800"
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
      "high": "bg-red-100 text-red-800",
      "medium": "bg-yellow-100 text-yellow-800",
      "low": "bg-green-100 text-green-800"
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

  useEffect(()=>{
    const fetchDealOverView = async () =>
      {
        try{
          const res = await getDealOverView(deal_id)
        setDeal(res)

        }catch(error){
          console.error("Failed to fetch deal overview:", error);
        }
        
      }
      if( deal_id ){
        fetchDealOverView()
        }

    
  },[deal_id,change])

 const handleAddNote = async (data) => {
  console.log(data);

  try {
    const res = await dealAddNote(data);
    console.log("Note added:", res);
    setChange(true)
 
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

  const notes = Array.isArray(deals.dealNotes) ? deals.dealNotes : [];
  console.log(notes);
  
  return (
    <DashboardLayout>
   
      {/* Header Section with Edit Button */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{deals.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Stage: <strong className="text-gray-900">{deals.stage}</strong>
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Expected Close: <strong className="text-gray-900">{deals.expected_close_date}</strong>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 mb-2">₹{deals.amount}</div>
            <div className="flex items-center gap-3">
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${dealsUtils.getStatusColor(deals.status)}`}>
                {getStatusIcon(deals.status)}
                {deals.status}
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit Deal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account & Contact Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                <span className="text-gray-900">{deals.account_id?.name}</span>
                {/* <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {deal.account.type}
                </span> */}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Assigned to: <strong>{deals?.owner?.name}</strong></span>
              </div>
            </div>
          </div>

          
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{deals?.dealContact?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{deals.dealContact?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{deals.dealContact?.phone_number}</span>
                </div>
              </div>
            </div>
          
        </div>
      </div>

      {/* Deal Description / Notes */}
     <NotesDescription notes={notes} onAddNote={handleAddNote} dealId={deals.deal_id} />

      {/* Tags & Meta */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Priority & Source
        </h2>
        <div className="flex flex-wrap gap-3">
          <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${getPriorityColor(deals.priority)}`}>
            <AlertCircle className="w-4 h-4" />
            Priority: {deals.priority?.toUpperCase()}
          </div>
          <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${getSourceColor(deals.source)}`}>
            <Users className="w-4 h-4" />
            Source: {deals.source}
          </div>
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
    
    </DashboardLayout>
  );
};

export default DealViewUI;