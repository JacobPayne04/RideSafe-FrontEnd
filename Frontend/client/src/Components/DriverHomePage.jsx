import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

const DriverHomePage = () => {
    const [notifications, setNotifications] = useState([]); // State to store notifications
    const navigate = useNavigate();
    const driverId = localStorage.getItem("driverId"); // Retrieve driver ID from localStorage

    useEffect(() => {
        if (!driverId) {
            console.error("Driver ID is not available in localStorage.");
            return;
        }

        // Initialize WebSocket client
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log("WebSocket connected for driver:", driverId);

            // Subscribe to the driver's topic for ride requests
            client.subscribe(`/topic/driver/${driverId}`, (message) => {
                console.log("Received message:", message.body);
                const notification = message.body; // Assuming message.body is a string
                alert(notification); // Display the notification
                setNotifications((prev) => [...prev, notification]); // Add notification to state
            });

            // Subscribe to ride updates for redirection
            client.subscribe(`/topic/ride/${driverId}`, (message) => {
                const data = JSON.parse(message.body); // Assuming message.body is JSON
                if (data.redirect) {
                    navigate(`/ride/${data.rideId}`); // Redirect to ride details page
                }
            });
        };

        client.activate(); // Activate the WebSocket connection

        // Clean up WebSocket connection on component unmount
        return () => client.deactivate();
    }, [driverId, navigate]);

    // Accept a ride by publishing a message to the backend
    const acceptRide = (rideId) => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        });

        client.onConnect = () => {
            client.publish({
                destination: `/app/ride/accept/${rideId}`,
            });
        };

        client.activate();
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
