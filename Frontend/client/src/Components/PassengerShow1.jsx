import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PassengerShow1 = () => {
    const { id } = useParams(); // Extract the passenger ID from the route parameters
    const [passenger, setPassenger] = useState(null); // State to store passenger details
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        let isMounted = true; // Flag to track component mount status
    
        const fetchPassenger = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/passenger/${id}`);
            if (isMounted) {
              setPassenger(response.data); // Update state with the fetched passenger data
            }
          } catch (err) {
            if (isMounted) {
              setError(err.response?.data?.message || err.message || "Error fetching passenger data");
            }
          }
        };
    
        fetchPassenger();
    
        return () => {
          isMounted = false; // Set flag to false if the component unmounts
        };
      }, [id]);
    
      if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
      }
      if (!passenger) {
        return <div>Loading...</div>;
      }
    
  return (
    <div>
        <h1>Passenger Details</h1>
        <p><strong>Name:</strong> {passenger.firstName}</p>
        <p><strong>Lastname:</strong> {passenger.lastName}</p>
        {/* Display additional passenger details here as needed */}
    </div>
  )
}

export default PassengerShow1