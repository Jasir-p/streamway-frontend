import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentForm from './Invoice';

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentResult = (success, error = null) => {
    setPaymentSuccess(success);
    setError(error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Payment</h2>

        {paymentSuccess ? (
          <div className="text-center py-8">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. Your transaction has been processed successfully.
            </p>
            
            {/* Success Details Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Invoice ID:</span>
                <span className="font-semibold text-gray-800">#{invoiceId}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid
                </span>
              </div>
            </div>
            
            {/* Action Button */}
            <button 
              onClick={() => navigate(`${subdomain}/dashboard`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        ) : !paymentSuccess && error ? (
          <div className="text-center py-8">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            
            {/* Error Message */}
            <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">
              We encountered an issue processing your payment. Please try again.
            </p>
            
            {/* Error Details Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-left">
                <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                <p className="text-sm text-red-700 break-words">{error}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setError(null);
                  setPaymentSuccess(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/support')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Contact Support
              </button>
            </div>
          </div>
        ) : (
          <PaymentForm invoiceId={invoiceId} onPaymentResult={handlePaymentResult} />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;