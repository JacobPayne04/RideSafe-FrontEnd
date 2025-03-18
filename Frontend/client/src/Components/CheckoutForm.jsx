import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../Styling/CheckoutForm.css"; // Import the CSS file

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }) // Amount in cents ($50.00) (we need to change this later to prefil amount with ride amount)
      });

      const { clientSecret } = await response.json();
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        setError(error.message);
        setSuccess(false);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2 className="checkout-title">Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="card-input">
            <CardElement />
          </div>
          <button
            type="submit"
            disabled={loading || !stripe}
            className="pay-button"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Payment Successful!</p>}
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
