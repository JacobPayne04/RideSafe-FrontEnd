import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Styling/ViewRideById.css'; 

const ViewRideById = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ride/${rideId}`);
        setRide(response.data);
      } catch (err) {
        setError('Failed to fetch ride details.');
      } finally {
        setLoading(false);
      }
    };

    if (rideId) {
      fetchRide();
    }
  }, [rideId]);

  const acceptRide = async () => {
    try{
      const response = await axios.put(`http://localhost:8080/${rideId}/accept`);
      setRide(response.data);
    } catch {
      setError("Failed to update ride")
    }
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ride-details">
      <h2 className="ride-title">Ride Details</h2>
      {ride ? (
        <div className="ride-info">
          <p><strong>Passenger ID:</strong> {ride.passengerId}</p>
          <p><strong>Driver ID:</strong> {ride.driverId}</p>
          <p><strong>From Location:</strong> {ride.fromLocation}</p>
          <p><strong>To Location:</strong> {ride.toLocation}</p>
            <p><strong>Status:</strong> {ride.status}</p>
          <p><strong>Created At:</strong> {new Date(ride.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No ride found.</p>
      )}
    </div>
  );
};

export default ViewRideById;
