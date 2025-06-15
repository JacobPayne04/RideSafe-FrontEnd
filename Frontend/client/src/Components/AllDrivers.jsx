import React, { useEffect, useState } from 'react';
import '../Styling/AllDrivers.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/drivers/all`)
      .then((response) => {
        setDrivers(response.data);
        console.log('Response from server:', response.data);
      })
      .catch((error) => {
        console.log('There was an error fetching the drivers!', error);
      });
  }, []);

  const RemoveDriver = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete/driver/${id}`);
      console.log("Successfully deleted driver");
      setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
    } catch (error) {
      console.log("Error deleting driver", error);
    }
  };
   return (
    <div className="admin-container">
      <h1 className="admin-main-title">All Drivers</h1>
      
      {/* Navigation Section */}
      <div className="admin-navigation-section">
        <Link to="/admin/home" className="admin-nav-button admin-nav-link">
          Back to Admin Home
        </Link>
        <Link to="/admin/passengers" className="admin-nav-button admin-nav-link">
          View All Passengers
        </Link>
        <Link to="/test" className="admin-nav-button admin-nav-link">
          Test
        </Link>
      </div>

      {/* Drivers Section */}
      <div className="admin-stats-section">
        <h2 className="admin-section-title">Driver Directory</h2>
        {drivers.length === 0 ? (
          <p className="admin-no-pending-message">No drivers found</p>
        ) : (
          <div className="admin-drivers-list">
            {drivers.map((driver) => (
              <div key={driver._id} className="admin-pending-driver-box">
                <div className="admin-driver-info">
                  <p className="admin-driver-name">
                    {driver.firstName} {driver.lastName}
                  </p>
                  <p className="admin-driver-details">{driver.email}</p>
                  <p className="admin-driver-details">License: {driver.licensePlate}</p>
                </div>
                <div className="admin-driver-button-section">
                  <button className="admin-button admin-view-button">
                    View Details
                  </button>
                  <button onClick={() => RemoveDriver(driver.id)} className="admin-button admin-decline-button">
                    Remove Driver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDrivers;