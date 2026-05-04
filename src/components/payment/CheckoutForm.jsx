import React, { useState, useMemo } from 'react'; // Re-saved to clear stale eslint error
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

/**
 * CheckoutForm handles the actual payment submission using Stripe's PaymentElement.
 * 
 * @param {string} collaborationId - Used for redirect/success tracking
 * @param {function} onSuccess - Callback for UI updates after payment is confirmed
 */
const CheckoutForm = ({ collaborationId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Memoize options to prevent re-renders of the PaymentElement
  const paymentElementOptions = useMemo(() => ({
    layout: "tabs",
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL for Stripe to redirect back after processing (useful for 3DS)
        return_url: `${window.location.origin}/dashboard/collaboration/${collaborationId}?payment_success=true`,
      },
      // If we don't want a redirect (e.g. for card success without 3DS), 
      // confirmPayment might return immediately.
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      // Payment succeeded!
      if (onSuccess) onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        onReady={() => setIsReady(true)}
      />

      {message && (
        <div id="payment-message" className="text-red-500 text-sm font-medium animate-pulse">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !isReady || !stripe || !elements}
        id="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Fund Escrow Now"
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
