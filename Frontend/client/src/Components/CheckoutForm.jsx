import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../Styling/CheckoutForm.css";
import { useNavigate } from "react-router-dom";
import { PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";



const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [rate, setRate] = useState(0);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const [paymentRequest, setPaymentRequest] = useState(null);

  const rideId = localStorage.getItem("rideId");
  const passengerAmount = localStorage.getItem("passengerAmount");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        if (!rideId || !passengerAmount) {
          setError("Missing ride details.");
          return;
        }

        const response = await fetch(`http://localhost:8080/details/${rideId}`);
        if (!response.ok) throw new Error("Failed to fetch ride details.");

        const data = await response.json();
        setRate(data.rate || 0);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        setError("Failed to retrieve ride details.");
      }
    };

    fetchRideDetails();
  }, [rideId, passengerAmount]);

  useEffect(() => {
    if (!stripe || !rate) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Ride Payment",
        amount: parseInt(rate * 100), // cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });
  }, [stripe, rate]);

  useEffect(() => {
    if (!showTimerPopup) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimerPopup(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimerPopup]);

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleRefund = () => {
    alert("Refund requested.");
    // fetch('/refund', { method: 'POST', body: JSON.stringify({ rideId }) })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

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
          rideId,
          rate: parseInt(rate),
        }),
      });

      const responseBody = await response.json();
      if (!response.ok) throw new Error("Failed to create payment intent.");

      const { clientSecret } = responseBody;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setError(error.message);
        setSuccess(false);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
        setShowTimerPopup(true);

        const updateResponse = await fetch("http://localhost:8080/update-ride-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId }),
        });

        if (!updateResponse.ok) {
          console.error("Failed to update ride payment status.");
        }
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    }

    setLoading(false);
  };

  const CancelPayment = () => {
    navigate("/Passenger/home");
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
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
            <p className="amount-display">Total: ${rate.toFixed(2)}</p>

            {paymentRequest ? (
              <PaymentRequestButtonElement options={{ paymentRequest }} className="pay-button" />
            ) : (
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
              </form>
            )}

            {error && <p className="error-message">{error}</p>}
            {success && (
              <>
                <p className="success-message">Payment Successful!</p>
                <p style={{ marginTop: "10px" }}>
                  You covered the ride. Share these links so the other riders can pay you back:
                </p>

                <div className="payment-request-links">
                  {[...Array(passengerAmount - 1)].map((_, i) => {
                    const splitAmount = (rate / passengerAmount).toFixed(2);
                    const note = encodeURIComponent("Ride share split");
                    const venmoLink = `https://venmo.com?txn=pay&audience=private&amount=${splitAmount}&note=${note}`;
                    const cashAppLink = `https://cash.app/$yourcashappusername/${splitAmount}`;
                    const paypalLink = `https://paypal.me/yourpaypalusername/${splitAmount}`;

                    return (
                      <div key={i} className="payment-box">
                        <p>Rider {i + 2}</p>
                        <a href={venmoLink} target="_blank" rel="noopener noreferrer">Venmo</a>
                        <a href={cashAppLink} target="_blank" rel="noopener noreferrer">Cash App</a>
                        <a href={paypalLink} target="_blank" rel="noopener noreferrer">PayPal</a>
                      </div>
                    );
                  })}
                </div>

                <p style={{ marginTop: "10px", fontSize: "0.85rem" }}>
                  Replace <code>$yourcashappusername</code> and <code>yourpaypalusername</code> with your actual usernames.
                </p>
              </>
            )}

            <button className="cancel-button" onClick={CancelPayment}>Cancel</button>
          </>
        )}
      </div>

      <div>
        <Link to="/passenger/ride/waiting">done</Link>
      </div>

      {showTimerPopup && (
        <div className="timer-popup">
          <p>Refund available for: {formatTime(timeLeft)}</p>
          <button onClick={handleRefund} className="refund-button">Request Refund</button>
        </div>
      )}

      <div>
        <button
          style={{
            cursor: 'pointer',
            padding: '15px 30px',
            backgroundColor: '#ff6b00',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.3)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
          }}
        >
          <Link to="/test" style={{ textDecoration: 'none', color: 'white' }}>TEST</Link>
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
