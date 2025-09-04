import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styling/PassengerHomePage.css';

const PassengerHomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [passengerData, setPassengerData] = useState(null);
  const [error, setError] = useState(null);

  // Get passenger ID from localStorage
  const passengerId = localStorage.getItem('passengerId') || 'current-user-id';

  // Fetch passenger data from backend
  useEffect(() => {
    const fetchPassengerData = async () => {
      try {
        setProfileLoading(true);
        const response = await axios.get(`http://localhost:8080/api/v1/passengers/${passengerId}`);
        setPassengerData(response.data);
        setProfileLoading(false);
      } catch (err) {
        console.error("Failed to fetch passenger data:", err);
        setError("Failed to load profile information.");
        setProfileLoading(false);
      }
    };

    fetchPassengerData();
  }, [passengerId]);

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

      const position = await getCurrentLocation();
      const requestBody = {
        longitude: position.longitude,
        latitude: position.latitude
      };

      await axios.put(`http://localhost:8080//api/v1/passengers/${passengerId}/status`, requestBody);
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
    try {
      const locationUpdated = await updatePassengerLocation(passengerId);
      if (locationUpdated) {
        navigate('/passenger/show1/Booking');
      }
    } catch (err) {
      setError("Unable to book a ride. Please try again later.");
    }
  };

  // Navigate to profile settings
  const handleProfileSettings = () => {
    navigate('/Passenger/home/settings');
  };

  // Handle quick action clicks
  const handleQuickAction = (action) => {
    switch (action) {
      case 'history':
        navigate('/passenger/ride-history');
        break;
      case 'payment':
        navigate('/passenger/payment-methods');
        break;
      case 'promotions':
        navigate('/passenger/promotions');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (profileLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Test Button */}
      <div className="test-button-container">
        <Link to="/test" className="test-button">
          TEST
        </Link>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {passengerData?.profilePicture ? (
              <img src={passengerData.profilePicture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {passengerData?.name ? getInitials(passengerData.name) : '?'}
              </div>
            )}
            {passengerData?.verified && (
              <div className="verified-badge">✓</div>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{passengerData?.name || 'Unknown User'}</h1>
            <p className="profile-joined">Member since {formatDate(passengerData?.joinDate)}</p>
          </div>

          <button className="settings-button" onClick={handleProfileSettings}>
            ⚙️
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">{passengerData?.totalRides || 0}</div>
            <div className="stat-label">Total Rides</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="contact-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <span className="contact-text">{passengerData?.email}</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📱</span>
            <span className="contact-text">{passengerData?.phone}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="action-section">
          <button
            onClick={handleBookRide}
            disabled={loading}
            className="book-ride-button"
          >
            {loading ? 'Updating location...' : '🚗 Book a Ride'}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="quick-action-item" onClick={() => handleQuickAction('history')}>
            <span className="action-icon">🕒</span>
            <span className="action-text">Ride History</span>
          </div>
          <div className="quick-action-item" onClick={() => handleQuickAction('payment')}>
            <span className="action-icon">💳</span>
            <span className="action-text">Payment Methods</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default PassengerHomePage;