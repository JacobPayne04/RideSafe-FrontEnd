import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styling/PassengerShow1.css';

const PassengerShow1 = () => {
  const [onlineDrivers, setOnlineDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const passengerId = localStorage.getItem('passengerId');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyDrivers = async () => {
      const latitude = localStorage.getItem('passengerLatitude');
      const longitude = localStorage.getItem('passengerLongitude');
  
      if (!latitude || !longitude) {
        console.error('❌ Missing passenger coordinates in localStorage');
        return;
      }
  
      try {
        const res = await axios.post('http://localhost:8080/nearby/drivers', {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        });
        setOnlineDrivers(res.data);
      } catch (error) {
        console.error('❌ Error fetching nearby drivers:', error);
      }
    };
  
    fetchNearbyDrivers();
  }, []);
  

  const handleNav = () => {
    navigate(`/passenger/${passengerId}/book/ride/driver/${selectedDriverId}`);
  };

  const handleBookNowClick = (driverId) => {
    setSelectedDriverId(driverId); // Set the selected driver's ID
    setShowPopup(true); // Show the confirmation popup
  };

  const handleCancel = () => {
    setShowPopup(false); // Hide the popup
  };
  return (
    <div className="passenger-show-container">
      <h1 className="passenger-show-title">Available Drivers</h1>
      <div className="driver-list">
        {onlineDrivers.map((driver) => (
          <div className="driver-card" key={driver.id}>
            <div className="driver-avatar">
              <span className="avatar-placeholder">👤</span>
            </div>
            <div className="driver-info">
              <p className="driver-name">{driver.firstName} {driver.lastName}</p>
              <p className="driver-id">ID: {driver.id}</p>
            </div>
            <button className="book-ride-btn" onClick={() => handleBookNowClick(driver.id)}>Book Ride</button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to book a ride with this driver?</p>
            <div className="popup-buttons">
              <button className="popup-yes" onClick={handleNav}>Yes, Continue</button>
              <button className="popup-cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerShow1;
