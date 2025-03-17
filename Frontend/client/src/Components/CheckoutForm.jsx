import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch payment intent when component loads
    axios
      .post("http://localhost:8080/ ", {
        passengerCount: 2, 
        rate: 20, 
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Error fetching payment intent:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setMessage(`❌ Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setMessage("✅ Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">Complete Payment</h2>
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe || !clientSecret || loading}
        className="mt-3 p-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
