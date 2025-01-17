import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const DriverHomePage = ({ driverId }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const clientRef = useRef(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            // Subscribe to ride updates for redirection
            const subscription = client.subscribe(`/topic/ride/${driverId}`, (message) => {
                console.log('Received message:', message);
                const data = JSON.parse(message.body); // Assuming message.body is JSON
                if (data.redirect) {
                    console.log('Redirecting to ride:', data.rideId);
                    navigate(`/ride/${data.rideId}`); // Redirect to ride details page
                } else {
                    console.log('Received notification:', data.notification);
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        data.notification,
                    ]);
                }
            });

            console.log('Subscribed to topic:', `/topic/ride/${driverId}`);
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error:', frame.headers['message']);
            console.error('Additional details:', frame.body);
        };

        client.activate(); // Activate the WebSocket connection
        clientRef.current = client;

        // Clean up WebSocket connection on component unmount
        return () => {
            console.log('Disconnecting from WebSocket');
            client.deactivate();
        };
    }, [driverId, navigate]);

    // Accept a ride by publishing a message to the backend
    const acceptRide = (rideId) => {
        if (clientRef.current && clientRef.current.connected) {
            console.log('Accepting ride:', rideId);
            clientRef.current.publish({
                destination: `/app/ride/accept/${rideId}`,
            });
        } else {
            console.error('WebSocket client is not connected');
        }
    };

    return (
        <div>
            <h2>Driver Dashboard</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        <p>{notification}</p>
                        <button onClick={() => acceptRide(notification.rideId)}>
                            Accept Ride
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DriverHomePage;