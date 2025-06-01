import React, { useState, useEffect } from 'react';
import '../Styling/PassengerHomePage.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PassengerHomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const passengerId = localStorage.getItem('passengerId');
  const [error, setError] = useState(null);

  //fix passenger id grab then DONE 

  // Function to get current location using browser's Geolocation API
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Save coordinates in localStorage
            localStorage.setItem('passengerLatitude', position.coords.latitude);
            localStorage.setItem('passengerLongitude', position.coords.longitude);

            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    });
  };

  // Function to update passenger location in the backend
  const updatePassengerLocation = async (passengerId) => {
    try {
      setLoading(true);
      setError(null);

      // Get current position
      const position = await getCurrentLocation();

      // Create request body with coordinates
      const requestBody = {
        longitude: position.longitude,
        latitude: position.latitude
      };

      // Make API call to update passenger location
      await axios.put(`http://localhost:8080/${passengerId}/status/passenger`, requestBody);

      console.log("Passenger location updated successfully:", position);
      return true;
    } catch (err) {
      console.error("Failed to update passenger location:", err);
      setError("Failed to update your location. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle Book Ride button click
  const handleBookRide = async () => {
    // Get passenger ID from local storage or context
    const passengerId = localStorage.getItem('passengerId') || 'current-user-id';

    try {
      // Update location before navigating
      const locationUpdated = await updatePassengerLocation(passengerId);

      if (locationUpdated) {
        // Navigate to booking page
        navigate('/passenger/show1/Booking');
      }
    } catch (err) {
      setError("Unable to book a ride. Please try again later.");
    }
  };

  // Navigate to profile page
  const handleProfileClick = () => {
    navigate('/Passenger/home/settings');
  };

  return (
    <div className="passenger-home-container">
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
      <div className="header-section">
        <h1>Welcome to Ride Share</h1>
        <div className="profile-icon" onClick={handleProfileClick}>
          <span className="profile-emoji">👤</span>
        </div>
      </div>

      <div className="main-action-section">
        <button
          onClick={handleBookRide}
          disabled={loading}
          className="book-ride-button"
        >
          {loading ? 'Updating location...' : 'Book a Ride'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

    </div>
  );
};

export default PassengerHomePage;