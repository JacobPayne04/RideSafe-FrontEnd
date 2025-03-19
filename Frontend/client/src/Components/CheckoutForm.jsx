import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../Styling/CheckoutForm.css";
import { useParams, useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate()
  const RideAmount = 5000 // Amount in cents ($50.00)

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

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
        body: JSON.stringify({ amount: {RideAmount} }) // Amount in cents ($50.00)
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

  const CancelPayment = () => {
    navigate("/Passenger/home")
  }

  return (
    <div className="checkout-container">
      <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="checkout-box">
        <h2 className="checkout-title">Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="card-input">
            <CardElement options={{ style: { base: { fontSize: "16px", color: darkMode ? "white" : "black", "::placeholder": { color: darkMode ? "#ccc" : "#666",  }, }, invalid: { color: "#ff4d4d",  }, }, }}/>
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
        <button className="cancel-button" onClick={CancelPayment}>Cancel</button>
      </div>
    </div>
  );
};

export default CheckoutForm;
