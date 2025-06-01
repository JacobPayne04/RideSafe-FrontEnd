import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DriverRating from './DriverRating';
import { Link } from 'react-router-dom';


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
    <div className="p-4 text-center">
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
      <h1 className="text-xl mb-4">Waiting for your driver to complete the ride...</h1>

      {showRatingPopup && driverId && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <div className='bg-white p-4 rounded shadow-lg'>
            <DriverRating driverId={driverId} onClose={() => setShowRatingPopup(false)} />
          </div>
        </div>
      )}

      {!showRefund && (
        <p className="text-gray-600 mt-4">Refund available in: <strong>{formatTime(timeLeft)}</strong></p>
      )}

      {showRefund && (
        <div className="mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleRefundRequest}
          >
            Request Refund
          </button>
        </div>
      )}
    </div>
  );
};
export default PassengerRideWaitingScreen