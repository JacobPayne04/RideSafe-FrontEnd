import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
              )}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '4px',
                marginTop: '5px'
              }}
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
  
  const acceptRide = async (rideId, fromLatitude, fromLongitude, toLatitude, toLongitude) => {
    try {
      await axios.put(`http://localhost:8080/${rideId}/accept`);
      toast.success("Ride accepted successfully!");

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.rideId === rideId ? { ...notification, status: "ONGOING" } : notification
        )
      );
    } catch (error) {
      toast.error("Failed to update ride");
      console.error("Error accepting ride:", error);
    }
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

  const endRide = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/${rideId}/accept/complete`);
      console.log("Ride ended successfully!", response.data);
    } catch (error) {
      console.error("Failed to update ride:", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => endRide()}>END RIDE</button>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {travelInfo.distance && travelInfo.duration && (
          <p>
            <strong>Estimated Ride:</strong> {travelInfo.distance} - {travelInfo.duration}
          </p>
        )}
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
                onClick={() => acceptRide(notification.rideId, notification.fromLatitude, notification.fromLongitude, notification.toLatitude, notification.toLongitude)}
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
