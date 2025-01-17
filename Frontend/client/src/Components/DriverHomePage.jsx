import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

const DriverHomePage = ({ driverId }) => {
        const [notifications, setNotifications] = useState([]);
        const navigate = useNavigate();
    
        useEffect(() => {
            // Initialize WebSocket client
            const client = new Client({
                webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
                debug: (str) => console.log(str),
            });
    
            client.onConnect = () => {
                // Subscribe to the driver's notification topic
                client.subscribe(`/topic/driver/${driverId}`, (message) => {
                    const data = JSON.parse(message.body);
                    setNotifications((prev) => [...prev, data]); // Store new notifications
                    alert(`New Ride Request! From: ${data.fromLocation}, To: ${data.toLocation}`);
                });
    
                // Subscribe to ride updates (e.g., acceptance redirection)
                client.subscribe(`/topic/ride/${driverId}`, (message) => {
                    const data = JSON.parse(message.body);
                    if (data.redirect) {
                        navigate(`/ride/${data.rideId}`); // Redirect to ride details
                    }
                });
            };
    
            client.activate();
    
            // Clean up the WebSocket connection on unmount
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
                            <p>
                                From: {notification.fromLocation}, To: {notification.toLocation}
                            </p>
                            <button onClick={() => acceptRide(notification.rideId)}>
                                Accept Ride
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
export default DriverHomePage