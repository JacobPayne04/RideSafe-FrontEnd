import React from 'react';
import '../Styling/PassengerHomePage.css';
import { useNavigate } from 'react-router-dom';

const PassengerHomePage = () => {
  const navigate = useNavigate();

  // Navigate to the PassengerShow1 page when booking
  const handleBookRide = () => {
    navigate('/passenger/show1/Booking');
  };

  // Navigate to profile page
  const handleProfileClick = () => {
    navigate('/Passenger/home/settings');
  };

  return (
    <div className="passenger-home-container">
      <div className="header-section">
        <h1>Driver App</h1>
        <div className="profile-icon" onClick={handleProfileClick}>
          <span className="profile-emoji">👤</span>
        </div>
      </div>

      <div className="main-action-section">
        <button className="book-ride-button" onClick={handleBookRide}>
          Book a Ride
        </button>
      </div>
    </div>
  );
};

export default PassengerHomePage;