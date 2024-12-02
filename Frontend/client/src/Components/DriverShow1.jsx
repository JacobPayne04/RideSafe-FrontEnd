import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styling/DriverShow1.css';
import axios from 'axios';

const DriverShow1 = () => {
  const { id } = useParams(); 
  const [driver, setDriver] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; 
    const fetchDriver = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/driver/${id}`);
        if (isMounted) {
          setDriver(response.data); 
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Error fetching driver data");
        }
      }
    };
    fetchDriver();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleStatus = async () => {
    if (loading) return;
    const newStatus = !driver.online; // Use the correct property name
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:8080/${id}/status`,
        null,
        { params: { isOnline: newStatus } } // Assuming the backend expects 'isOnline'
      );
      setDriver((prevDriver) => ({
        ...prevDriver,
        online: newStatus, // Update the correct property in state
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!driver) {
    return <div>Loading...</div>;
  }

  return (
    <div className="driver-container">
      <h1 className='Driver-Details'>Driver Details</h1>
      <div className="driver-info">
        <p><strong>Name:</strong> {driver.firstName}</p>
        <p><strong>Lastname:</strong> {driver.lastName}</p>
        <p className="status-text">{`Driver is ${driver.online ? "online" : "offline"}`}</p>
      </div>
      <div
        onClick={toggleStatus}
        className={`toggle-button ${driver.online ? "online" : "offline"}`}
      >
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
};

export default DriverShow1;
