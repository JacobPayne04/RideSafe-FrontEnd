import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styling/DriverShow1.css';
import { getCurrentCoords } from '../utils/geolocation';

const DriverShow1 = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDriver = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/driver/${id}`);
        if (isMounted) {
          setDriver(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Error fetching driver data");
        }
      }
    };

    fetchDriver();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const goOnline = async () => {
    getCurrentCoords(async (err, coords) => {
      if (err) {
        alert("Location access denied: " + err.message);
        return;
      }

      try {
        await axios.put(
          `http://localhost:8080/driver/${id}/online`,
          {
            longitude: coords.longitude,
            latitude: coords.latitude,
          }
        );
        setDriver(prev => ({ ...prev, online: true }));
      } catch (err) {
        console.error("Failed to update location:", err);
        alert("Could not go online.");
      }
    });
  };

  const toggleStatus = async () => {
    if (loading || !driver) return;
    const goingOnline = !driver.online;
    setLoading(true);

    if (goingOnline) {
      await goOnline();
    } else {
      try {
        await axios.put(`http://localhost:8080/${id}/status`, null, {
          params: { isOnline: false },
        });
        setDriver(prev => ({ ...prev, online: false }));
      } catch (err) {
        console.error("Failed to go offline:", err);
        alert("Could not go offline.");
      }
    }

    setLoading(false);
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!driver) {
    return <div>Loading...</div>;
  }

  return (
    <div className="driver-container">
      <div className="driver-info">
        <div className='Profile-Img-Name-Section'>
          <img
            src="https://i0.wp.com/toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png"
            className='Default-Profile-Picture'
            alt="Profile"
          />
          <div>
            <div className='First-Last-Name-Section'>
              <p className='First-Name-Driver'>{driver.firstName}</p>
              <p className='Last-Name-Driver'>{driver.lastName}</p>
              <p>Driver ID: {driver.id}</p>
            </div>
            <div>0.0 ⭐ 0 ratings</div>

            <div className='Settings-Online-Section'>
              <p className="status-text">{`You are ${driver.online ? "online" : "offline"}`}</p>
              <div
                onClick={toggleStatus}
                className={`toggle-button ${driver.online ? "online" : "offline"}`}
              >
                <div className="toggle-thumb"></div>
              </div>
            </div>

            <div><Link to={`/driver/home/${id}`}>View Rides</Link></div>
            <div><Link to={`/edit/driver/${id}/info`}>Edit Profile</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverShow1;
