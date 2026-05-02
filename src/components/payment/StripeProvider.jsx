import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

/**
 * StripeProvider wraps the payment-related components.
 * It provides the Stripe context to its children.
 *
 * @param {string} clientSecret - The secret from the PaymentIntent created on the backend
 */
const StripeProvider = ({ children, clientSecret }) => {
  // Use useMemo to ensure loadStripe is handled correctly and only initialized once
  const stripePromise = useMemo(() => {
    const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error("Stripe Publishable Key is missing from environment variables!");
      return loadStripe("pk_test_your_key_here");
    }
    return loadStripe(key);
  }, []);

  if (!clientSecret) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#6366f1", // Indigo 500
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
