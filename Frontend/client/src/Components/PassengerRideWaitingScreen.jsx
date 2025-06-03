import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DriverRating from './DriverRating';
import { Link } from 'react-router-dom';
import '../Styling/PassengerRideWaitingScreen.css';

const PassengerRideWaitingScreen = () => {
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [showRefund, setShowRefund] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 minutes
  const passengerId = localStorage.getItem('passengerId');

  // Initialize timer with persistent state
  useEffect(() => {
    const initializeTimer = () => {
      const now = Date.now();
      const storedStartTime = sessionStorage.getItem('timerStartTime');
      const storedRefundShown = sessionStorage.getItem('refundShown');

      // If refund was already shown, don't restart timer
      if (storedRefundShown === 'true') {
        setShowRefund(true);
        setTimeLeft(0);
        return;
      }

      let startTime;

      if (storedStartTime) {
        // Use existing start time
        startTime = parseInt(storedStartTime);
      } else {
        // Set new start time
        startTime = now;
        sessionStorage.setItem('timerStartTime', startTime.toString());
      }

      // Calculate remaining time
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, 600 - elapsed); // 600 seconds = 10 minutes

      setTimeLeft(remaining);

      if (remaining === 0) {
        setShowRefund(true);
        sessionStorage.setItem('refundShown', 'true');
      }
    };

    initializeTimer();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          setShowRefund(true);
          sessionStorage.setItem('refundShown', 'true');
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // WebSocket for driver ride end
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/passenger/${passengerId}`, (msg) => {
          const payload = JSON.parse(msg.body);
          if (payload.type === 'RIDE_ENDED') {
            setDriverId(payload.driverId);
            setShowRatingPopup(true);
            // Clear timer storage when ride ends
            sessionStorage.removeItem('timerStartTime');
            sessionStorage.removeItem('refundShown');
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [passengerId]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleRefundRequest = () => {
    alert("Refund requested");
    // Clear timer storage after refund is requested
    sessionStorage.removeItem('timerStartTime');
    sessionStorage.removeItem('refundShown');
  };

  return (
    <div className="passenger-waiting-container">
      {/* Main Content Container */}
      <div className="passenger-waiting-content">
        {/* Test Button */}
        <div className="test-button-section">
          <button className="test-button">
            <Link to="/test">TEST</Link>
          </button>
        </div>

        {/* Main Heading */}
        <h1 className="main-heading">
          Waiting for your driver to complete the ride...
        </h1>

        {/* Status Section */}
        <div className="status-section">
          {/* Timer Display */}
          {!showRefund && (
            <div className="timer-display">
              <span className="timer-label">Refund available in:</span>
              <br />
              <span className="timer-value">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {/* Refund Button */}
          {showRefund && (
            <div className="refund-button-section">
              <button
                className="refund-button"
                onClick={handleRefundRequest}
              >
                Request Refund
              </button>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <p className="additional-info">
          Please wait while your driver completes the journey. You'll be notified once the ride is finished 
          and can then rate your experience.
        </p>
      </div>

      {/* Rating Popup */}
      {showRatingPopup && driverId && (
        <div className="rating-popup-overlay">
          <div className="rating-popup-content">
            <DriverRating 
              driverId={driverId} 
              onClose={() => setShowRatingPopup(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerRideWaitingScreen;