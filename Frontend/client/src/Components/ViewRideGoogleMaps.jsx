import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { acceptRide, completeRide } from '../RideServices/RideProccessing.js';
import '../Styling/ViewRideGoogleMaps.css'

const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const libraries = ["places"];

const ViewRideGoogleMaps = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const rideId = params.get("rideId");
  const driverId = typeof window !== 'undefined' ? localStorage.getItem("driverId") : null;
  const fromLat = parseFloat(params.get("fromLat"));
  const fromLng = parseFloat(params.get("fromLng"));
  const toLat = parseFloat(params.get("toLat"));
  const toLng = parseFloat(params.get("toLng"));
  const navigate = useNavigate();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelInfo, setTravelInfo] = useState({ distance: "", duration: "" });
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!driverId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      client.subscribe(`/topic/driver/${driverId}`, (message) => {
        const notification = JSON.parse(message.body);
        console.log("Notification received:", notification);

        // Custom Toast Content
        const CustomToast = () => (
          <div className="custom-toast-content">
            <p>Passenger {notification.passengerId} booked a ride.</p>
            <button
              className="toast-accept-btn"
              onClick={() => acceptRide(
                notification.rideId,
                notification.fromLatitude,
                notification.fromLongitude,
                notification.toLatitude,
                notification.toLongitude
              )}
            >
              Accept Ride
            </button>
          </div>
        );

        // Triggering Toast with Custom Content
        toast.info(<CustomToast />, {
          autoClose: false,
          closeOnClick: false
        });

        setNotifications((prev) => [
          ...prev,
          { ...notification, status: notification.status || "PENDING" }
        ]);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('Disconnecting from WebSocket');
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [driverId]);

  const handleAcceptRide = async (rideId) => {
    const driverId = localStorage.getItem("driverId");
    acceptRide(rideId, driverId);
  };

  const handleEndRide = async (rideId) => {
    const driverId = localStorage.getItem("driverId");
    completeRide(rideId, driverId);
    navigate(`/driver/home/${driverId}`);
  };

  useEffect(() => {
    if (isLoaded && fromLat && fromLng && toLat && toLng) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: fromLat, lng: fromLng },
          destination: { lat: toLat, lng: toLng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirectionsResponse(result);

            const route = result.routes[0].legs[0];
            setTravelInfo({
              distance: route.distance.text,
              duration: route.duration.text,
            });
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [isLoaded, fromLat, fromLng, toLat, toLng]);

  return (
    <div className="ride-maps-container">
      {/* Control Buttons */}
      <button className="End-Ride-Btn" onClick={() => handleEndRide(rideId)}>
        END RIDE
      </button>
      
      <div className="test-button-container">
        <button className="test-button">
          <Link to="/test">TEST</Link>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="ride-info-card">
        {/* Travel Information */}
        {travelInfo.distance && travelInfo.duration && (
          <div className="travel-info">
            <p>
              <strong>Estimated Ride:</strong> {travelInfo.distance} - {travelInfo.duration}
            </p>
          </div>
        )}

        {/* Google Maps */}
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: fromLat, lng: fromLng }}
            zoom={14}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        {notifications.length > 0 && (
          <h3 className="notifications-title">Ride Notifications</h3>
        )}
        
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No new ride requests at the moment</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="notification-card">
              <p>
                Passenger <span className="passenger-name">{notification.passengerName}</span> booked a ride.
              </p>
              {notification.rideId && (
                <>
                  <button
                    className="accept-ride-btn"
                    onClick={() => handleAcceptRide(notification.rideId, notification.fromLatitude, notification.fromLongitude, notification.toLatitude, notification.toLongitude)}
                    disabled={notification.status !== 'PENDING'}
                  >
                    {notification.status === 'PENDING' ? "Accept Ride" : "Ride Accepted"}
                  </button>
                  {notification.status !== 'PENDING' && (
                    <div className="ride-status-accepted">
                      ✓ This ride has been accepted
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ViewRideGoogleMaps;