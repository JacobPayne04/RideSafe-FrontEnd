import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../Styling/CheckoutForm.css";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [rate, setRate] = useState(0);  // Default to 0 to avoid null issues

  const rideId = localStorage.getItem("rideId");
  const passengerAmount = localStorage.getItem("passengerAmount");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    console.log('Ride ID:', rideId);
    console.log('Passenger Count:', passengerAmount);
  
    const fetchRideDetails = async () => {
      try {
        if (!rideId || !passengerAmount) {
          setError("Missing ride details.");
          return;
        }
  
        const response = await fetch(`http://localhost:8080/details/${rideId}`);
        if (!response.ok) throw new Error("Failed to fetch ride details.");
  
        const data = await response.json();
        console.log('Fetched ride details:', data);  // Add this log
        setRate(data.rate || 0);  // Set rate, or fallback if not present
      } catch (error) {
        console.error("Error fetching ride details:", error);
        setError("Failed to retrieve ride details.");
      }
    };
  
    fetchRideDetails();
  }, [rideId, passengerAmount]);
  

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  
    // Check for missing ride details and valid Stripe elements
    if (!stripe || !elements || !rideId || !passengerAmount || rate === 0) {
      setError("Missing ride details. Please try again.");
      setLoading(false);
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    try {
      const response = await fetch("http://localhost:8080/create-Payment-Intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId: rideId,
          rate: parseInt(rate),  // Ensure it's parsed as an integer
        }),
      });
  
      const responseBody = await response.json();
      console.log('Response from /create-Payment-Intent:', responseBody);
      if (!response.ok) throw new Error("Failed to create payment intent.");
  
      const { clientSecret, paymentIntentId } = responseBody;  // Get both clientSecret and paymentIntentId
      console.log("Client Secret:", clientSecret);
      console.log("Payment Intent ID:", paymentIntentId);  // Log the paymentIntentId
  
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
      });
      
      console.log('PaymentIntent:', paymentIntent);
      console.log('Stripe Error:', error);
  
      if (error) {
        setError(error.message);
        setSuccess(false);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
  
        // Update the ride as paid
        await fetch(`http://localhost:8080/update-ride-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId }),
        });
  
        setTimeout(() => navigate("/Passenger/home"), 2000);
      }
    } catch (err) {
      setError("Something went wrong.", err);
    }
  
    setLoading(false);
  };

  const CancelPayment = () => {
    navigate("/Passenger/home");
  };

  return (
    <div className="checkout-container">
      <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="checkout-box">
        <h2 className="checkout-title">Checkout</h2>
        {rate === 0 ? (
          <p>Loading ride amount...</p>
        ) : (
          <>
            <p className="amount-display">Total: ${(rate).toFixed(2)}</p>
            <form onSubmit={handleSubmit}>
              <div className="card-input">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: darkMode ? "white" : "black",
                        "::placeholder": { color: darkMode ? "#ccc" : "#666" },
                      },
                      invalid: { color: "#ff4d4d" },
                    },
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !stripe || rate === 0}
                className="pay-button"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">Payment Successful!</p>}
            </form>
            <button className="cancel-button" onClick={CancelPayment}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
