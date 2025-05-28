import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styling/AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const [pendingDrivers, setPendingDrivers] = useState([]); // ✅ plural and consistent

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => { // ✅ corrected name
    try {
      const res = await axios.get(`http://localhost:8080/drivers/unapproved`); // ✅ corrected URL typo
      setPendingDrivers(res.data);
    } catch (err) {
      console.log('Failed to fetch unapproved drivers', err);
    }
  };

  const handleApprove = async (driverId) => {
    try {
      await axios.put(`http://localhost:8080/approve/driver/${driverId}`); // ✅ template literal syntax
      fetchPendingDrivers(); // ✅ fixed spelling
    } catch (err) {
      console.error('Error approving driver', err);
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
          pendingDrivers.map((driver) => (
            <div key={driver.id} className='admin-pending-driver-box'>
              <p className="admin-driver-name">{driver.firstName} {driver.lastName}</p>
              <div className="admin-driver-button-section">
                <button className='admin-button admin-accept-button' onClick={() => handleApprove(driver.id)}>Accept Driver</button>
                <button className='admin-button admin-decline-button'>Decline Driver</button>
                <button className='admin-button admin-view-button'>View Driver</button>
              </div>
            </div>
          ))
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
