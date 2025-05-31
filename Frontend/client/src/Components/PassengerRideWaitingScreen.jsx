import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DriverRating from './DriverRating'; 

const PassengerRideWaitingScreen = () => {
  const [showRating, setShowRating] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const passengerId = localStorage.getItem('passengerId');

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/passenger/${passengerId}`, (msg) => {
          const payload = JSON.parse(msg.body);
          if (payload.type === 'RIDE_ENDED') {
            setDriverId(payload.driverId);
            setShowRating(true);
          }
        });
      },
    });
  
    client.activate();
  
    return () => client.deactivate();
  }, [passengerId]);

  return (
    <div>
      <h1>Waiting for your driver to complete the ride...</h1>
      {showRating && driverId && (
        <DriverRating driverId={driverId} onClose={() => setShowRating(false)} />
      )}
    </div>
  );
};

export default PassengerRideWaitingScreen