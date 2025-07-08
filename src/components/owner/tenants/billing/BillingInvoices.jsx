import React, { useState, useEffect } from 'react';
import defaultInterceptor from '../../../../Intreceptors/defaultInterceptors';
import { Pencil, FileText, Download, X, ChevronRight, Clock, CheckCircle, AlertCircle,CreditCard } from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../dashboard/Layout';

const TenantBillingInvoices = () => {
  const [billingInfo, setBillingInfo] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();
  const {billing_id} = useParams()

  useEffect(() => {
    // fetchBillingInfo();
    fetchInvoices();
  }, []);

//   const fetchBillingInfo = async () => {
//     try {
//       setLoading(true);
//       const res = await subdomainInterceptors.get('/api/tenant/billing/');
//       
      
//       setBillingInfo(res.data);

//       setLoading(false);
//     } catch {
//       setError('Failed to load billing information');
//       setLoading(false);
//     }
//   };

const fetchInvoices = async () => {
  try {
    const res = await defaultInterceptor.get(
      '/api/admin/billings/tenant_bill_invoices',
      { params: { billing_id: billing_id } }  
    );
    
    setInvoices(res.data);
    setLoading(false);  
  } catch (error) {
    
    setError('Failed to load invoices');
  }
};

const markasPaid = async (id) =>{
  try {
    const res = await defaultInterceptor.post(
      `/api/admin/billings/${id}/mark_as_paid/`
      );
      
  }
  catch{
    
  }
}

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };
  
  
  const getStatusText = (status) => {
    switch(status) {
      case 'paid':
        return <span className="text-green-600 font-medium">Paid</span>;
      case 'pending':
        return <span className="text-yellow-600 font-medium">Pending</span>;
      case 'failed':
        return <span className="text-red-600 font-medium">Failed</span>;
      default:
        return <span className="text-gray-600">{status}</span>;
    }
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="max-w-6xl mx-auto px-4 py-8 ">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stripe-like Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800"> Billing Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage tenant billing information and view invoice history</p>
      </div>

      {/* Billing Summary Card */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Tenant Billing Information</h2>
            <button 
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Pencil className="w-4 h-4 mr-1.5" />
              Edit Contact Info
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Billing Contact</p>
              <p className="mt-1 text-sm text-gray-900">{billingInfo?.billing_name}</p>
              <p className="mt-1 text-sm text-gray-900">{billingInfo?.billing_email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subscription Details</p>
              <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Active Users:</span> {billingInfo?.active_count_users}</p>
              <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Rate per user:</span> ${billingInfo?.per_user_rate}</p>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-900">Total Monthly Charge</p>
              <p className="text-xl font-semibold text-gray-900">₹{billingInfo?.bill_amount}</p>
            </div>
          </div>
        </div>
      </div> */}


      {/* Invoices Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Invoice History</h3>
        </div>
        
        {invoices.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {invoices.map((inv) => (
              <div key={inv.id} className="px-6 py-4 hover:bg-gray-50">

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getStatusIcon(inv.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Invoice #{inv.stripe_invoice_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(inv.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium text-gray-900">₹{inv.amount}</p>
                    {getStatusText(inv.status)}
                    
                    {inv.invoice_pdf ? (
                      <a
                        href={inv.invoice_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50"
                        title="Download Invoice"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No PDF</span>
                    )}
                    {inv.status !== "paid" ? (
                      <button
                        onClick={()=>markasPaid(inv.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        
                        <span>Mark as Paid</span>
                      </button>
                    ) : null}
                    
                    <ChevronRight className="w-5 h-5 text-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
            <p className="mt-1 text-sm text-gray-500">No invoice history available yet.</p>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default TenantBillingInvoices;