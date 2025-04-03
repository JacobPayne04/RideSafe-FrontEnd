import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { useJsApiLoader } from "@react-google-maps/api";

const DriverHomePage = () => {
    const [notifications, setNotifications] = useState([]);
    const [onGoingRides, setOngoingRides] = useState([]);
    const navigate = useNavigate();
    const clientRef = useRef(null);
    const driverId = localStorage.getItem("driverId");

    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const libraries = ["places"];

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const fetchOngoingRides = () => {
        if (!driverId) return;
        axios.get(`http://localhost:8080/driver/${driverId}/rides/ongoing`)
            .then(response => {
                setOngoingRides(response.data);
                console.log('Updated Ongoing Rides:', response.data);
            })
            .catch(error => {
                console.error('Error fetching ongoing rides:', error);
            });
    };

    useEffect(() => {
        if (!driverId) return;
    
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),  // Adjusted to "/ws"
        });
    
        client.onConnect = () => {
            console.log('Connected to WebSocket');
            client.subscribe(`/topic/driver/${driverId}`, (message) => {
                const notification = JSON.parse(message.body);
                console.log("Notification received:", notification);

                toast(<div>
                        <p>{notification.message}</p>
                        <button onClick={() => acceptRide(notification.rideId)}>Accept Ride</button>
                    </div>);

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

    const acceptRide = (rideId) => {
        console.log("Ride Accepted with ID:", rideId);
        
        // Send a PUT request to the backend with the rideId and driverId in the URL
        axios.put(`http://localhost:8080/${rideId}/accept/${driverId}`)
            .then(response => {
                console.log("Ride accepted successfully:", response.data);
                // Optionally, update the notifications or ride status here
                setNotifications((prevNotifications) =>
                    prevNotifications.filter(notification => notification.rideId !== rideId)
                );
                fetchOngoingRides();  // Refresh ongoing rides
                toast("Ride accepted!");
            })
            .catch(error => {
                console.error("Error accepting the ride:", error);
                toast.error("Failed to accept the ride.");
            });
    };
    

    useEffect(() => {
        fetchOngoingRides();
    }, [driverId]);

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
                        <button onClick={() => acceptRide(notification.rideId)}>Accept Ride</button>
                    </li>
                ))}
            </ul>

            <div>
                <p>ONGOING RIDES</p>
                {onGoingRides.length !== 0 ? (
                    onGoingRides.map((ride, index) => (
                        <div key={index}>
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
