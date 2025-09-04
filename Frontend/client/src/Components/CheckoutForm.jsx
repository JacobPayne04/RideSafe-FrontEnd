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
  const [darkMode, setDarkMode] = useState(false); 
  const [rate, setRate] = useState(0);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const [paymentRequest, setPaymentRequest] = useState(null);

  // Mock data for demo - replace with localStorage in your environment
  const rideId = "demo-ride-123";
  const passengerAmount = 3;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        if (!rideId || !passengerAmount) {
          setError("Missing ride details.");
          return;
        }

        // Mock API call for demo
        setTimeout(() => {
          setRate(25.50); // Demo rate
        }, 1000);

        // Original API call (commented for demo)
        /*
        const response = await fetch(`http://localhost:8080/details/${rideId}`);
        if (!response.ok) throw new Error("Failed to fetch ride details.");
        const data = await response.json();
        setRate(data.rate || 0);
        */
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
    setShowTimerPopup(false);
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
      // Mock payment processing for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setShowTimerPopup(true);

      // Original payment processing (commented for demo)
      /*
      const response = await fetch("http://localhost:8080/api/v1/create-Payment-Intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, rate: parseInt(rate) }),
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

        const updateResponse = await fetch("http://localhost:8080/api/v1/rides/update-ride-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rideId }),
        });

        if (!updateResponse.ok) {
          console.error("Failed to update ride payment status.");
        }
      }
      */
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
    <div className="checkout-main-container">
      {/* Header with controls */}
      <div className="checkout-header">
        <div className="header-controls">
          <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
            <span className="toggle-icon">{darkMode ? "☀️" : "🌙"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          
          <div className="test-button-container">
            <button className="test-button">
              <Link to="/test">TEST</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Main checkout content */}
      <div className="checkout-content">
        <div className="checkout-card">
          <div className="checkout-header-section">
            <h1 className="checkout-title">
              <span className="checkout-icon">💳</span>
              Secure Payment
            </h1>
            <p className="checkout-subtitle">Complete your ride payment safely</p>
          </div>

          {rate === 0 ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading ride amount...</p>
            </div>
          ) : (
            <>
              {/* Amount display */}
              <div className="amount-section">
                <div className="amount-card">
                  <span className="amount-label">Total Amount</span>
                  <span className="amount-value">${rate.toFixed(2)}</span>
                  <span className="amount-detail">{passengerAmount} passengers • ${(rate / passengerAmount).toFixed(2)} per person</span>
                </div>
              </div>

              {/* Payment form */}
              <div className="payment-section">
                {paymentRequest ? (
                  <div className="express-payment">
                    <div className="section-title">Express Payment</div>
                    <PaymentRequestButtonElement 
                      options={{ paymentRequest }} 
                      className="express-pay-button" 
                    />
                    <div className="payment-divider">
                      <span>or pay with card</span>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="payment-form">
                  <div className="form-section">
                    <label className="form-label">Card Information</label>
                    <div className="card-input-wrapper">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: darkMode ? "white" : "#333",
                              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                              "::placeholder": { color: darkMode ? "#ccc" : "#999" },
                            },
                            invalid: { color: "#ff4d4d" },
                          },
                        }}
                        className="card-element"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !stripe || rate === 0}
                    className="pay-button"
                  >
                    {loading ? (
                      <>
                        <span className="button-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="button-icon">🔒</span>
                        Pay ${rate.toFixed(2)}
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Error and success messages */}
              {error && (
                <div className="message-card error-card">
                  <span className="message-icon">⚠️</span>
                  <span className="message-text">{error}</span>
                </div>
              )}

              {success && (
                <div className="success-section">
                  <div className="message-card success-card">
                    <span className="message-icon">✅</span>
                    <span className="message-text">Payment Successful!</span>
                  </div>

                  <div className="split-payment-section">
                    <div className="section-title">Request Split Payment</div>
                    <p className="split-description">
                      You covered the ride. Share these links so other riders can pay you back:
                    </p>

                    <div className="payment-links-grid">
                      {[...Array(passengerAmount - 1)].map((_, i) => {
                        const splitAmount = (rate / passengerAmount).toFixed(2);
                        const note = encodeURIComponent("Ride share split");
                        const venmoLink = `https://venmo.com?txn=pay&audience=private&amount=${splitAmount}&note=${note}`;
                        const cashAppLink = `https://cash.app/$yourcashappusername/${splitAmount}`;
                        const paypalLink = `https://paypal.me/yourpaypalusername/${splitAmount}`;

                        return (
                          <div key={i} className="payment-link-card">
                            <div className="rider-label">Rider {i + 2}</div>
                            <div className="rider-amount">${splitAmount}</div>
                            <div className="payment-links">
                              <a href={venmoLink} target="_blank" rel="noopener noreferrer" className="payment-link venmo">
                                Venmo
                              </a>
                              <a href={cashAppLink} target="_blank" rel="noopener noreferrer" className="payment-link cashapp">
                                Cash App
                              </a>
                              <a href={paypalLink} target="_blank" rel="noopener noreferrer" className="payment-link paypal">
                                PayPal
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="setup-notice">
                      <span className="notice-icon">💡</span>
                      Replace <code>$yourcashappusername</code> and <code>yourpaypalusername</code> with your actual usernames.
                    </div>
                  </div>

                  <div className="navigation-section">
                    <Link to="/passenger/ride/waiting" className="continue-button">
                      Continue to Ride Status
                    </Link>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="action-buttons">
                <button className="cancel-button" onClick={CancelPayment}>
                  <span className="button-icon">←</span>
                  Cancel Payment
                </button>
              </div>

              {/* Security notice */}
              <div className="security-notice">
                <span className="security-icon">🔒</span>
                Your payment information is encrypted and secure. We never store your card details.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Timer popup */}
      {showTimerPopup && (
        <div className="popup-overlay">
          <div className="timer-popup">
            <div className="popup-header">
              <h3 className="popup-title">Refund Available</h3>
              <button 
                className="popup-close" 
                onClick={() => setShowTimerPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="timer-content">
              <div className="timer-display">
                <span className="timer-icon">⏱️</span>
                <span className="timer-text">{formatTime(timeLeft)}</span>
              </div>
              <p className="timer-description">
                You can request a refund within the next {formatTime(timeLeft)}
              </p>
              <button onClick={handleRefund} className="refund-button">
                <span className="button-icon">💰</span>
                Request Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;