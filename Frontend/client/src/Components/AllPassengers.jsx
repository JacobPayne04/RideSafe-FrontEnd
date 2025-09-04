import React, { useEffect, useState } from 'react';
import '../Styling/AllDrivers.css'; // Still using same CSS file
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllPassengers = () => {
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/admin/passengers/all`)
      .then((response) => {
        setPassengers(response.data);
        console.log('Passengers:', response.data);
      })
      .catch((error) => {
        console.log('Error fetching passengers:', error);
      });
  }, []);

  return (
    <div className="admin-container compact">
      <h1 className="admin-main-title">All Passengers</h1>

      <div className="admin-navigation-section">
        <Link to="/admin/home" className="admin-nav-button admin-nav-link">
          Back to Admin Home
        </Link>
        <Link to="/admin/drivers" className="admin-nav-button admin-nav-link">
          View All Drivers
        </Link>
        <Link to="/test" className="admin-nav-button admin-nav-link">
          Test
        </Link>
      </div>

      <div className="admin-stats-section">
        <h2 className="admin-section-title">Passenger Directory</h2>
        {passengers.length === 0 ? (
          <p className="admin-no-pending-message">No passengers found</p>
        ) : (
          <div className="admin-drivers-list">
            {passengers.map((passenger) => (
              <div key={passenger._id} className="admin-pending-driver-box compact-box">
                <div className="admin-driver-info">
                  <p className="admin-driver-name">{passenger.firstName} {passenger.lastName}</p>
                  <p className="admin-driver-details">{passenger.email}</p>
                </div>
                <div className="admin-driver-button-section">
                  <button className="admin-button admin-view-button">View</button>
                  <button className="admin-button admin-decline-button">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default AllPassengers;