import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styling/AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [expandedDriverId, setExpandedDriverId] = useState(null);

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/drivers/unapproved`);
      setPendingDrivers(res.data);
    } catch (err) {
      console.log('Failed to fetch unapproved drivers', err);
    }
  };

  const handleApprove = async (driverId) => {
    try {
      await axios.put(`http://localhost:8080/approve/driver/${driverId}`);
      fetchPendingDrivers();
      setExpandedDriverId(null); // close dropdown if open
    } catch (err) {
      console.error('Error approving driver', err);
    }
  };

  const handleDecline = (driverId) => {
    // Implement decline logic or alert for now
    alert(`Decline driver with ID: ${driverId}`);
  };

  const toggleExpand = (driverId) => {
    if (expandedDriverId === driverId) {
      setExpandedDriverId(null);
    } else {
      setExpandedDriverId(driverId);
    }
  };

  const ViewAllDrivers = () => {
    navigate("/drivers/all");
  };

  const ViewAllPassengers = () => {
    navigate("/passengers/all");
  };

  return (
    <div className="admin-container">
      <h1 className="admin-main-title">Admin Home Page</h1>

      <h1 className="admin-section-title">System & Safety Monitoring</h1>

      {/* Pending Drivers */}
      <div className='admin-stats-section'>
        <h1 className="admin-section-title">Pending Drivers</h1>
        {pendingDrivers.length === 0 ? (
          <p className="admin-no-pending-message">No pending drivers</p>
        ) : (
          pendingDrivers.map((driver) => {
            const isExpanded = expandedDriverId === driver.id;
            return (
              <div key={driver.id} className='admin-pending-driver-box'>
                <div className="admin-pending-header">
                  <p className="admin-driver-name">{driver.firstName} {driver.lastName}</p>
                  <div className="admin-driver-button-section">
                    <button
                      className='admin-button admin-accept-button'
                      onClick={() => handleApprove(driver.id)}
                    >
                      Accept Driver
                    </button>
                    <button
                      className='admin-button admin-decline-button'
                      onClick={() => handleDecline(driver.id)}
                    >
                      Decline Driver
                    </button>

                    {isExpanded ? (
                      <button
                        className='admin-button admin-close-button'
                        onClick={() => toggleExpand(driver.id)}
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        className='admin-button admin-view-button'
                        onClick={() => toggleExpand(driver.id)}
                      >
                        View Driver
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="admin-driver-details">
                    <p><strong>Email:</strong> {driver.email}</p>
                    <p><strong>Phone:</strong> {driver.phoneNumber || "N/A"}</p>
                    <p><strong>License Number:</strong> {driver.licenseNumber || "N/A"}</p>
                    <p><strong>Vehicle Info:</strong> {driver.vehicleInfo || "N/A"}</p>
                    {/* Add any other driver details you want here */}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="admin-navigation-section">
        <button className='admin-nav-button' onClick={ViewAllDrivers}>View All Drivers</button>
        <button className='admin-nav-button' onClick={ViewAllPassengers}>View All Passengers</button>
      </div>
    </div>
  );
};

export default AdminHome;
