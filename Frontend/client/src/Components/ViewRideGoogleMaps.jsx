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
  width: "90%",
  height: "700px",
  marginLeft: "5%"
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
          <div>
            <p>Passenger {notification.passengerId} booked a ride.</p>
            <button
              onClick={() => acceptRide(
                notification.rideId,
                notification.fromLatitude,
                notification.fromLongitude,
                notification.toLatitude,
                notification.toLongitude
              )} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}
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
    <div>
      <button className="End-Ride-Btn" onClick={() => handleEndRide(rideId)}>END RIDE</button>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {travelInfo.distance && travelInfo.duration && (
          <p>
            <strong>Estimated Ride:</strong> {travelInfo.distance} - {travelInfo.duration}
          </p>
        )}
      </div>
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
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: fromLat, lng: fromLng }}
        zoom={14}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      <div>
        {notifications.map((notification, index) => (
          <div key={index} style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
            backgroundColor: "#f8f9fa"
          }}>
            <p>This passenger {notification.passengerName} booked a ride.</p>
            {notification.rideId && (
              <button
                onClick={() => handleAcceptRide(notification.rideId, notification.fromLatitude, notification.fromLongitude, notification.toLatitude, notification.toLongitude)}
                disabled={notification.status !== 'PENDING'}
                style={{
                  backgroundColor: notification.status === 'PENDING' ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: notification.status === 'PENDING' ? 'pointer' : 'not-allowed'
                }}
              >
                {notification.status === 'PENDING' ? "Accept Ride" : "Ride is Accepted"}
              </button>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewRideGoogleMaps;
