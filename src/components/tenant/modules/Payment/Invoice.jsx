import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  AlertCircle, 
  Loader, 
  CheckCircle,
  Users,
  DollarSign,
  Lock
} from 'lucide-react';
import subdomainInterceptors from '../../../../Intreceptors/getSubdomainInterceptors';
import PaymentPage from './PaymentPage';

const PaymentForm = ({ invoiceId,onPaymentResult }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [invoice, setInvoice] = useState(null);
  

  

  useEffect(() => {

    const fetchPaymentIntent = async () => {
      try {
        const response = await subdomainInterceptors.get(`/api/tenant/invoices/${invoiceId}/payment_intent/`);
        
        
        setClientSecret(response.data.client_secret);
        setInvoice(response.data.invoice);
      } catch (err) {
        setError('Could not load payment information. Please try again later.');
      }
    };

    fetchPaymentIntent();
  }, [invoiceId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: invoice?.tenant_name,
          email: invoice?.tenant_email,
        },
      },
    });

    setLoading(false);

  if (error) {
    
    onPaymentResult(false, error.message);
  } else if (paymentIntent.status === 'succeeded') {
    onPaymentResult(true);
  }
    
}

  if (!invoice || !clientSecret) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="text-blue-500 animate-spin mr-2" size={24} />
        <span className="text-gray-600">Loading payment details...</span>
      </div>
    );
  }
  

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <CreditCard className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold">Pay Invoice #{invoiceId}</h2>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <DollarSign className="text-blue-700 mr-2" size={18} />
            <span className="text-gray-700 font-medium">Amount:</span>
            <span className="ml-2 text-blue-700 font-bold">${invoice.amount}</span>
          </div>
          <div className="flex items-center">
            <Users className="text-blue-700 mr-2" size={18} />
            <span className="text-gray-700 font-medium">For:</span>
            <span className="ml-2">{invoice.user_count} users</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    iconColor: '#3b82f6',
                  },
                  invalid: {
                    color: '#e11d48',
                    iconColor: '#e11d48',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!stripe || loading}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
            !stripe || loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition-colors`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2" size={20} />
              Pay ${invoice.amount}
            </>
          )}
        </button>
        
        <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
          <Lock size={12} className="mr-1" />
          Your payment is secure and encrypted
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;