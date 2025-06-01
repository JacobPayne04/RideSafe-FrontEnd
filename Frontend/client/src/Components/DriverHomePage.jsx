import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { useJsApiLoader } from '@react-google-maps/api';
import '../Styling/DriverHomePage.css';

const DriverHomePage = () => {
  const [notifications, setNotifications] = useState([]);
  const [onGoingRides, setOngoingRides] = useState([]);
  const navigate = useNavigate();
  const clientRef = useRef(null);
  const driverId = localStorage.getItem('driverId');

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const libraries = ['places'];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const fetchOngoingRides = () => {
    if (!driverId) return;
    axios
      .get(`http://localhost:8080/driver/${driverId}/rides/ongoing`)
      .then((response) => {
        setOngoingRides(response.data);
      })
      .catch((error) => {
        console.error('Error fetching ongoing rides:', error);
      });
  };

  useEffect(() => {
    if (!driverId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    });

    client.onConnect = () => {
      client.subscribe(`/topic/driver/${driverId}`, (message) => {
        const notification = JSON.parse(message.body);
        toast(
          <div>
            <p>{notification.message}</p>
            <button className="register-card" onClick={() => acceptRide(notification.rideId)}>
              Accept Ride
            </button>
          </div>
        );
        setNotifications((prev) => [
          ...prev,
          { ...notification, status: notification.status || 'PENDING' },
        ]);
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [driverId]);

  const acceptRide = (rideId) => {
    axios
      .put(`http://localhost:8080/${rideId}/accept/${driverId}`)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.rideId !== rideId));
        fetchOngoingRides();
        toast('Ride accepted!');
      })
      .catch((error) => {
        console.error('Error accepting the ride:', error);
        toast.error('Failed to accept the ride.');
      });
  };

  useEffect(() => {
    fetchOngoingRides();
  }, [driverId]);

  return (
    <div className="register-container">
      <h1 className="register-header">Driver Dashboard</h1>

      <Link className="register-card no-link-style" to={`/one/driver/${driverId}`}>
        🚀 Go to Online Driver Page
      </Link>

      <div className="card-container">
        <h2 className="section-header">Notifications</h2>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div className="register-card" key={index}>
              <p>{notification.message}</p>
              <button className="register-card" onClick={() => acceptRide(notification.rideId)}>
                Accept Ride
              </button>
            </div>
          ))
        ) : (
          <p>No new ride requests.</p>
        )}
      </div>

      <div className="card-container">
        <h2 className="section-header">Ongoing Rides</h2>
        {onGoingRides.length > 0 ? (
          onGoingRides.map((ride, index) => (
            <div className="register-card" key={index}>
              <p>
                <strong>From:</strong> {ride.fromLocation}
              </p>
              <p>
                <strong>To:</strong> {ride.toLocation}
              </p>
              <p>
                <strong>Passenger ID:</strong> {ride.passengerId}
              </p>
              <button
                className="register-card"
                onClick={() =>
                  navigate(
                    `/view/ride/googlemaps?rideId=${ride.id}&fromLat=${ride.fromLatitude}&fromLng=${ride.fromLongitude}&toLat=${ride.toLatitude}&toLng=${ride.toLongitude}`
                  )
                }
              >
                View in Google Maps
              </button>
            </div>
          ))
        ) : (
          <p>No ongoing rides.</p>
        )}
      </div>

      <ToastContainer />

      <div>
        <button
          style={{
            cursor: 'pointer',
            padding: '15px 30px',
            backgroundColor: '#ff6b00',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.3)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
          }}
        >
          <Link to="/test" style={{ textDecoration: 'none', color: 'white' }}>TEST</Link>
        </button>
      </div>

    </div>
  );
};

export default DriverHomePage;
