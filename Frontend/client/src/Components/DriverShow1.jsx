import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../Styling/DriverShow1.css';
import { getCurrentCoords } from '../utils/geolocation';
import DriverRating from './DriverRating';

const DriverShow1 = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDriver = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/driver/${id}`);
        if (isMounted) {
          setDriver(response.data);
          console.log("Fresh driver data from API - isOnline:", response.data.isOnline);
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

  // Monitor driver state changes
  useEffect(() => {
    if (driver) {
      console.log("Driver state updated - isOnline:", driver.isOnline);
    }
  }, [driver]);

  const goOnline = async (coords) => {
    try {
      await axios.put(
        `http://localhost:8080/${id}/status`,
        {
          isOnline: true,
          longitude: coords.longitude,
          latitude: coords.latitude
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Longitude:", coords.longitude);
      console.log("Latitude:", coords.latitude);
      console.log("Driver before update:", driver);
      setDriver(prev => ({ ...prev, isOnline: true }));
    } catch (err) {
      console.error("Failed to go online:", err);
      alert("Could not go online.");
    }
  };

  const goOffline = async () => {
    try {
      await axios.put(
        `http://localhost:8080/${id}/status`,
        {
          isOnline: false
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setDriver(prev => ({ ...prev, isOnline: false }));
    } catch (err) {
      console.error("Failed to go offline:", err);
      alert("Could not go offline.");
    }
  };

  const toggleStatus = async () => {
    if (loading || !driver) return;
    setLoading(true);

    if (!driver.isOnline) {
      getCurrentCoords(async (err, coords) => {
        if (err) {
          alert("Location access denied: " + err.message);
          setLoading(false);
          return;
        }
        await goOnline(coords);
        setLoading(false);
      });
    } else {
      await goOffline();
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!driver) {
    return <div>Loading...</div>;
  }

  const driverEmail = localStorage.getItem('driverEmail')
  const driverId = localStorage.getItem('driverId');

  const onboardStripe = async () => {
    try {
      const res = await fetch(`/api/stripe/onboard?email=${driverEmail}&driverId=${driverId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error('Stripe Onboarding request failed')
      }

      const url = await res.text();
      window.location.href = url; // send them to Stripe onboarding
    } catch (err) {
      console.log("stripe onboarding error: ", err)
      alert("failed to redirect to Stripe Onboarding")
    }
  };

  return (
    <div className="driver-container">
      <div className="driver-info">
        <div className='Profile-Img-Name-Section'>
          <img
            src="https://i0.wp.com/toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png"
            className='Default-Profile-Picture'
            alt="Profile"
          />
          <div className='Profile-Info-Section'>
            <div className='First-Last-Name-Section'>
              <p className='First-Name-Driver'>{driver.firstName}</p>
              <p className='Last-Name-Driver'>{driver.lastName}</p>
            </div>
            <div>0.0 ⭐ 0 ratings</div>

            <div className='Settings-Online-Section'>
              <p className="status-text">{`You are ${driver.isOnline ? "online" : "offline"}`}</p>
              <div
                onClick={toggleStatus}
                className={`toggle-button ${driver.isOnline ? "online" : "offline"}`}
              >
                <div className="toggle-thumb"></div>
              </div>
            </div>

            <div className='Driver-Profile-Button-Section'>
              <div className='Driver-Button-Profile'><Link to={`/driver/home/${id}`}>View Rides</Link></div>
              <div className='Driver-Button-Profile'><Link to={`/edit/driver/${id}/info`}>Edit Profile</Link></div>
              <button className='Driver-Button-Profile' onClick={onboardStripe}>Finish Stripe Setup</button>
              <div className="Driver-Button-Profile">
                <button
                  className="Rate-Button"
                  onClick={() => setShowRatingPopup(prev => !prev)}
                >
                  {showRatingPopup ? "Close" : "Rate Driver"}
                </button>

                {showRatingPopup && (
                  <div className='fix inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
                    <div className='bg-white p-4 rounded shadow-lg'>
                      <DriverRating driverId={id} onClose={() => setShowRatingPopup(false)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
export default DriverShow1;
