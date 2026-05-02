import React from 'react';
import StripeProvider from './StripeProvider';
import CheckoutForm from './CheckoutForm';
import { X } from 'lucide-react';

/**
 * PaymentModal provides a popup UI for funding escrow.
 * 
 * @param {boolean} isOpen - Control visibility
 * @param {function} onClose - Function to close the modal
 * @param {string} clientSecret - From backend
 * @param {string} collaborationId - From backend
 * @param {function} onPaymentSuccess - Callback
 */
const PaymentModal = ({ isOpen, onClose, clientSecret, collaborationId, onPaymentSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Secure Escrow Funding</h2>
            <p className="text-sm text-gray-500 mt-1">Funds will be held by Stripe until you approve the work.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <StripeProvider clientSecret={clientSecret}>
            <CheckoutForm 
              collaborationId={collaborationId} 
              onSuccess={onPaymentSuccess} 
            />
          </StripeProvider>
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Payments are secured and encrypted by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
