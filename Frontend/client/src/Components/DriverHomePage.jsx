import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const DriverHomePage = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const clientRef = useRef(null);
    const driverId = typeof window !== 'undefined' ? localStorage.getItem("driverId") : null;

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            client.subscribe(`/topic/driver/${driverId}`, (message) => {
                const notification = JSON.parse(message.body);
                console.log("Notification received:", notification);
                toast(notification.message); // Show the message as a toast
                setNotifications((prev) => [...prev, notification]);
            });
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
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [driverId]);

    // Accept a ride by publishing a message to the backend
    const acceptRide = (rideId) => {
        if (clientRef.current && clientRef.current.connected) {
            console.log('Accepting ride:', rideId);
            clientRef.current.publish({
                destination: `/app/ride/accept/${rideId}`,
                body: JSON.stringify({ rideId }),
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
                        <p>{notification.message}</p>
                        {notification.rideId && (
                            <button onClick={() => acceptRide(notification.rideId)}>
                                Accept Ride
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <ToastContainer />
        </div>
    );
};

export default DriverHomePage;