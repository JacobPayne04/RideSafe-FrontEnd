import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      <h1 className="admin-main-title">Admin Dashboard</h1>

      <h2 className="admin-section-title">System & Safety Monitoring</h2>

      {/* Pending Drivers Section */}
      <div className='admin-stats-section'>
        <h2 className="admin-section-title">Pending Driver Approvals</h2>
        {pendingDrivers.length === 0 ? (
          <p className="admin-no-pending-message">
            ✅ No pending drivers - All applications have been processed!
          </p>
        ) : (
          <>
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#fff3e6', 
              borderRadius: '8px',
              borderLeft: '4px solid #ff6b00'
            }}>
              <p style={{ margin: 0, color: '#333', fontWeight: '600' }}>
                📋 {pendingDrivers.length} driver{pendingDrivers.length !== 1 ? 's' : ''} awaiting approval
              </p>
            </div>
            
            {pendingDrivers.map((driver) => {
              const isExpanded = expandedDriverId === driver.id;
              return (
                <div key={driver.id} className='admin-pending-driver-box'>
                  <div className="admin-pending-header">
                    <div>
                      <p className="admin-driver-name">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <span className="admin-status-indicator admin-status-pending">
                        Pending Review
                      </span>
                    </div>
                    
                    <div className="admin-driver-button-section">
                      <button
                        className='admin-button admin-accept-button'
                        onClick={() => handleApprove(driver.id)}
                        title="Approve this driver"
                      >
                        ✓ Accept
                      </button>
                      
                      <button
                        className='admin-button admin-decline-button'
                        onClick={() => handleDecline(driver.id)}
                        title="Decline this driver"
                      >
                        ✗ Decline
                      </button>

                      {isExpanded ? (
                        <button
                          className='admin-button admin-close-button'
                          onClick={() => toggleExpand(driver.id)}
                          title="Hide driver details"
                        >
                          ▲ Close
                        </button>
                      ) : (
                        <button
                          className='admin-button admin-view-button'
                          onClick={() => toggleExpand(driver.id)}
                          title="View driver details"
                        >
                          ▼ Details
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="admin-driver-details">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        <p><strong>📧 Email:</strong> {driver.email}</p>
                        <p><strong>📱 Phone:</strong> {driver.phoneNumber || "Not provided"}</p>
                        <p><strong>🆔 License Number:</strong> {driver.licenseNumber || "Not provided"}</p>
                        <p><strong>🚗 Vehicle Info:</strong> {driver.vehicleInfo || "Not provided"}</p>
                      </div>
                      
                      {driver.registrationDate && (
                        <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#666' }}>
                          <strong>📅 Applied:</strong> {new Date(driver.registrationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Navigation Section */}
      <div className="admin-navigation-section">
        <button className='admin-nav-button' onClick={ViewAllDrivers}>
          👥 View All Drivers
        </button>
        
        <button className='admin-nav-button' onClick={ViewAllPassengers}>
          🚶 View All Passengers
        </button>
        
        <Link to="/test" style={{ textDecoration: 'none' }}>
          <button className='admin-nav-button'>
            🧪 Test Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;