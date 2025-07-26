import React, { useState, useEffect } from 'react';
import defaultInterceptor from '../../../../Intreceptors/defaultInterceptors';
import { 
  Download, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  CreditCard
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import Layout from '../../dashboard/Layout';

const TenantBillingInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const { billing_id } = useParams();

  useEffect(() => {
    fetchInvoices();
  }, [billing_id]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await defaultInterceptor.get(
        '/api/admin/billings/tenant_bill_invoices',
        { params: { billing_id: billing_id } }
      );
      
      setInvoices(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (invoiceId) => {
    try {
      // Add to processing set to show loading state
      setProcessingIds(prev => new Set([...prev, invoiceId]));
      
      const res = await defaultInterceptor.post(
        `/api/admin/billings/${invoiceId}/mark_as_paid/`
      );
      
      // Update the specific invoice in state immediately for real-time feel
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, status: 'paid' }
            : invoice
        )
      );
      
      // Optional: Show success message
      // You can add a toast notification here if you have one
      
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      
      // Optional: Show error message
      setError('Failed to mark invoice as paid. Please try again.');
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      // Remove from processing set
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return <span className="text-green-600 font-medium">Paid</span>;
      case 'pending':
        return <span className="text-yellow-600 font-medium">Pending</span>;
      case 'failed':
        return <span className="text-red-600 font-medium">Failed</span>;
      default:
        return <span className="text-gray-600 capitalize">{status}</span>;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Tenant Billing Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage tenant invoices and payment status</p>
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Invoice History</h3>
              <span className="text-sm text-gray-500">
                {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {invoices.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const isProcessing = processingIds.has(invoice.id);
                const isPaid = invoice.status === 'paid';
                
                return (
                  <div 
                    key={invoice.id} 
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      {/* Left side - Invoice info */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(invoice.status)}
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Invoice #{invoice.stripe_invoice_id || invoice.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(invoice.created_at)}
                          </p>
                        </div>
                        
                        <div className={getStatusBadge(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </div>
                      </div>

                      {/* Right side - Amount and actions */}
                      <div className="flex items-center space-x-4">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{parseFloat(invoice.amount).toLocaleString()}
                        </p>

                        {/* Download PDF */}
                        {invoice.invoice_pdf ? (
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                            title="Download Invoice PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <span className="text-xs text-gray-400">No PDF</span>
                          </div>
                        )}

                        {/* Mark as Paid Button */}
                        {!isPaid && (
                          <button
                            onClick={() => markAsPaid(invoice.id)}
                            disabled={isProcessing}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                              isProcessing
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                            }`}
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </>
                            )}
                          </button>
                        )}

                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-sm text-gray-500">
                No invoice history available for this tenant yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TenantBillingInvoices;