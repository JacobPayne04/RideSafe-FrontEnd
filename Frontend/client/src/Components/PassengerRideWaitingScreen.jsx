import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import DriverRating from './DriverRating'; 


const PassengerRideWaitingScreen = () => {
  const [showRatingPopup, setShowRatingPopup] = useState(false);
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
            setShowRatingPopup(true); // ✅ Trigger modal here
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

      {showRatingPopup && driverId && (
        <div className='fix inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
          <div className='bg-white p-4 rounded shadow-lg'>
            <DriverRating driverId={driverId} onClose={() => setShowRatingPopup(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PassengerRideWaitingScreen