import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Calendar, CreditCard, FileText, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import PaymentForm from './Invoice';
import StripeProvider from './StripeProvider';
import PaymentPage from './PaymentPage';
import { useNavigate } from 'react-router-dom';







// Sample invoice data
const sampleInvoice = {
  id: "INV-2023-001",
  amount: 249.99,
  currency: "USD",
  issueDate: "2025-04-20",
  dueDate: "2025-06-08", // Today's date from the context
  status: "pending", // can be "paid" or "pending"
  
};

export default function InvoiceModal({onClose,invoices}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [invoice, setInvoice] = useState(invoices);
  const [showForm, setShowForm] = useState(false);
  const {invoiceStatus}= useSelector((state)=>state.invoice)
  const Navigate = useNavigate()
  if (!invoice){
    return null
  }

  const isExpired = new Date(invoice.tenant_billing?.billing_expiry) < new Date();
  const showCloseButton = !(isExpired && invoice.status === "pending");
  
  

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            {isExpired && invoice.status === "pending" ? (
              <AlertTriangle className="text-red-500 mr-2" size={20} />
            ) : invoice.status === "pending" ? (
              <FileText className="text-blue-500 mr-2" size={20} />
            ) : (
              <CheckCircle className="text-green-500 mr-2" size={20} />
            )}
            <h2 className="text-lg font-semibold">
              {isExpired && invoice.status === "pending" 
                ? "Payment Required" 
                : invoice.status === "pending"
                ? "New Invoice"
                : "Payment Confirmed"}
            </h2>
          </div>
          
          {/* Conditional close button */}
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {!showDetails ? (
  
  <div className="p-6">
    {isExpired && invoice.status === "pending" ? (
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Your Payment is Overdue</h3>
        <p className="text-gray-500">
          We were unable to process your payment for invoice #{invoice.id}.
          Your account access may be limited until payment is received.
        </p>
      </div>
    ) : invoice.status === "pending" ? (
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">New Invoice Available</h3>
        <p className="text-gray-500">
          A new invoice #{invoice.id} has been generated for your account.
          Please complete payment by { new Date(invoice.tenant_billing?.billing_expiry).toISOString().split('T')[0]
}.
        </p>
      </div>
    ) : null}


            
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md mb-6">
              <div>
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="text-xl font-bold"> {invoice.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className={`font-medium ${isExpired && invoice.status === "pending" ? "text-red-600" : ""}`}>
                  {new Date(invoice.tenant_billing?.billing_expiry).toISOString().split('T')[0]
}
                </p>
              </div>
            </div>
            
            {invoice.status === "pending" && (
              <button 
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
                onClick={()=>Navigate(`/setting/payment/invoice/${invoice.id}/pay`)}
              >
                {isExpired ? "Pay Overdue Invoice" : "Pay Now"}
                <ArrowRight size={16} className="ml-2" />
              </button>
            )}
            
            {invoice.status === "paid" && (
              <button 
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center justify-center"
                
              >
                View Invoice Details
                <ArrowRight size={16} className="ml-2" />
              </button>
            )}
          </div>
        ) : null}
      
       
      </div>
    </div>
  );
}