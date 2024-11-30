import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styling/DriverShow1.css';
import axios from 'axios';

const DriverShow1 = () => {
  const { id } = useParams(); // Extract the driver ID from the route parameters
  const [driver, setDriver] = useState(null); // State to store driver details
  const [error, setError] = useState(null); // State to handle errors
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchDriver = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/driver/${id}`);
        if (isMounted) {
          setDriver(response.data); // Update state with the fetched driver data
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Error fetching driver data");
        }
      }
    };

    fetchDriver();

    return () => {
      isMounted = false; // Set flag to false if the component unmounts
    };
  }, [id]);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }
  if (!driver) {
    return <div>Loading...</div>;
  }

  const toggleStatus = async () => {
    setIsOnline((prevStatus) => !prevStatus);

    // Send the updated status to the backend
    try {
      await fetch(`http://localhost:8080/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ online: !isOnline }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="driver-container">
      <h1 className='Driver-Details'>Driver Details</h1>
      <div className="driver-info">
        <p><strong>Name:</strong> {driver.firstName}</p>
        <p><strong>Lastname:</strong> {driver.lastName}</p>
        <p className="status-text">{`Driver is ${isOnline ? "online" : "offline"}`}</p>
      </div>
      <div
        onClick={toggleStatus}
        className={`toggle-button ${isOnline ? "online" : "offline"}`}
      >
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
};

export default DriverShow1;
