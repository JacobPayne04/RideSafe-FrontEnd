import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link, redirect } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { acceptRide } from '../RideServices/RideProccessing.js';
import { useJsApiLoader } from "@react-google-maps/api";

const DriverHomePage = () => {
    const [notifications, setNotifications] = useState([]);
    const [onGoingRides, setOngoingRides] = useState([]);
    const navigate = useNavigate();
    const clientRef = useRef(null);
    const driverId = typeof window !== 'undefined' ? localStorage.getItem("driverId") : null;

    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const libraries = ["places"];

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
      });
    
    // Function to fetch ongoing rides
    const fetchOngoingRides = () => {
        if (!driverId) return;
        axios
            .get(`http://localhost:8080/driver/${driverId}/rides/ongoing`)
            .then((response) => {
                setOngoingRides(response.data);
                console.log('Updated Ongoing Rides:', response.data);
            })
            .catch((error) => {
                console.log('Error fetching ongoing rides:', error);
            });
    };

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
                toast(notification.message);

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

    useEffect(() => {
        fetchOngoingRides(); // Fetch rides initially
    }, [driverId]);

    const handleAcceptRide = async (rideId, fromLatitude, fromLongitude, toLatitude, toLongitude) => {
        try {
            // Ensure Google Maps API is loaded before proceeding
            if (!isLoaded) {
                toast.error("Google Maps is still loading...");
                return;
            }

            const driverId = localStorage.getItem("driverId");
            if (!driverId) {
                toast.error("Driver ID not found.");
                return;
            }

            // ✅ Ensure ride is accepted before moving forward
            await acceptRide(rideId, driverId);

            // ✅ Fetch Google Maps URL after ride is accepted
            const response = await axios.get(`http://localhost:8080/${rideId}/MapRoute`);
            const googleMapsUrl = response.data.googleMapsUrl;

            if (googleMapsUrl) {
                // ✅ Navigate to Google Maps View
                navigate(
                    `/view/ride/googlemaps?rideId=${rideId}&fromLat=${fromLatitude}&fromLng=${fromLongitude}&toLat=${toLatitude}&toLng=${toLongitude}`
                );
            } else {
                toast.error("Failed to fetch Google Maps URL");
            }

            // ✅ Update ride status in notifications
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.rideId === rideId ? { ...notification, status: "ONGOING" } : notification
                )
            );

            fetchOngoingRides(); // ✅ Refresh ongoing rides list
        } catch (error) {
            toast.error("Failed to update ride");
            console.error("Error accepting ride:", error);
        }
    };



return (
    <div>
        <h2>Driver Dashboard</h2>
        <button>
            <Link to={`/one/driver/${driverId}`}>Driver Online Page</Link>
        </button>
        <ul>
            {notifications.map((notification, index) => (
                <li key={index}>
                    <p>{notification.message}</p>
                    {notification.rideId && (
                        <button
                            onClick={() => handleAcceptRide(notification.rideId, notification.fromLatitude, notification.fromLongitude, notification.toLatitude, notification.toLongitude)}
                            disabled={notification.status !== 'PENDING'}
                            className="accept-ride-btn"
                        >
                            {notification.status === 'PENDING' ? "Accept Ride" : "Ride is Accepted"}
                        </button>
                    )}
                </li>
            ))}
        </ul>

        <div>
            <p>ONGOING RIDES</p>
            {onGoingRides.length !== 0 ? (
                onGoingRides.map((ride, index) => (
                    <div>
                        <p>Start Location: {ride.fromLocation}</p>
                        <p>Destination Location: {ride.toLocation}</p>
                        <p>Passenger Id: {ride.passengerId}</p>
                        <button
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
                "There are no ongoing rides"
            )}
        </div>
        <ToastContainer />
    </div>
);
};

export default DriverHomePage;