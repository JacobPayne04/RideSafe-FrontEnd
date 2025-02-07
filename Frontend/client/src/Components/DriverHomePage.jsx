import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link, redirect } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const DriverHomePage = () => {
    const [notifications, setNotifications] = useState([]);
    const [onGoingRides, setOngoingRides] = useState([]);
    const navigate = useNavigate();
    const clientRef = useRef(null);
    const driverId = typeof window !== 'undefined' ? localStorage.getItem("driverId") : null;

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

    const acceptRide = async (rideId, fromLatitude, fromLongitude, toLatitude, toLongitude) => {
        try {
            //axios call to show ongoing rides
            await axios.put(`http://localhost:8080/${rideId}/accept`);
            toast.success("Ride accepted successfully!");
            //in same call we are fetching google maps url
            const response = await axios.get(`http://localhost:8080/${rideId}/MapRoute`);
            const googleMapsUrl = response.data.googleMapsUrl;

            //redering the google maps url
            if (googleMapsUrl) {
                navigate(`/view/ride/googlemaps?fromLat=${fromLatitude}&fromLng=${fromLongitude}&toLat=${toLatitude}&toLng=${toLongitude}`);
            } else {
                toast.error("Failed to fetch Google Maps URL");
            }

            // Update ride status in notifications
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.rideId === rideId ? { ...notification, status: "ONGOING" } : notification
                )
            );

            // Fetch the latest ongoing rides after accepting a ride
            fetchOngoingRides();
        } catch (error) {
            toast.error("Failed to update ride");
            console.error("Error accepting ride:", error);
        }
    };

    return (
        <div>
            <h2>Driver Dashboard</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        <p>{notification.message}</p>
                        {notification.rideId && (
                            <button
                                onClick={() => acceptRide(notification.rideId, notification.fromLatitude, notification.fromLongitude, notification.toLatitude,  notification.toLongitude)}
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
                        <Link key={index} to={`/view/ongoing/ride/${ride.id}`}>
                            <div>
                                <p>Start Location: {ride.fromLocation}</p>
                                <p>Destination Location: {ride.toLocation}</p>
                                <p>Passenger Id: {ride.passengerId}</p>
                            </div>
                        </Link>
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