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
    const fetchOnlineDrivers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/online/drivers');
        setOnlineDrivers(res.data);
      } catch (error) {
        console.error('❌ Error in fetching online drivers:', error);
      }
    };
    fetchOnlineDrivers();
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
    <div className="profile-container">
      {onlineDrivers.map((driver) => (
        <div className="profile-card" key={driver.id}>
          <div className="profile-pic-placeholder">Profile Pic</div>
          <div className="profile-info">
            <div className="Top-Line">
              <p>{driver.firstName} {driver.lastName}</p>
              <button onClick={() => handleBookNowClick(driver.id)}>Book Ride</button>
            </div>
            <p className="invisible-id">{driver.id}</p>
          </div>
        </div>
      ))}

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
