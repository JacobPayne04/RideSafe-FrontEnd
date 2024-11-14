import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DriverShow1 = () => {
  const { id } = useParams(); // Extract the driver ID from the route parameters
  const [driver, setDriver] = useState(null); // State to store driver details
  const [error, setError] = useState(null); // State to handle errors

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





  return (
    <div>
      <h1>Driver Details</h1>
      <p><strong>Name:</strong> {driver.firstName}</p>
      <p><strong>Lastname:</strong> {driver.lastName}</p>
      {/* Display additional driver details here as needed */}
    </div>
  );
};

export default DriverShow1;
