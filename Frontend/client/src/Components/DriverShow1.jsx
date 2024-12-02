import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styling/DriverShow1.css';
import axios from 'axios';

const DriverShow1 = () => {
  const { id } = useParams(); // Extract the driver ID from the route parameters
  const [driver, setDriver] = useState(null); // State to store driver details
  const [error, setError] = useState(null); // State to handle errors
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (loading) return;
  
    const newStatus = !isOnline;
    setIsOnline(newStatus); // Optimistic update
    setLoading(true);
  
    let putSuccess = false; // Track PUT success
  
    try {
      await axios.put(`http://localhost:8080/${id}/status`, null, {
        params: { isOnline: newStatus },
      });
      putSuccess = true;
    } catch (error) {
      console.error("Error updating status:", error);
      setIsOnline(!newStatus); // Revert state on failure
    } finally {
      setLoading(false);
  
      if (putSuccess) {
        try {
          const response = await axios.get(`http://localhost:8080/driver/${id}`);
          setIsOnline(response.data.isOnline); // Reset state with backend value
        } catch (fetchError) {
          console.error("Error fetching latest driver status:", fetchError);
        }
      }
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
