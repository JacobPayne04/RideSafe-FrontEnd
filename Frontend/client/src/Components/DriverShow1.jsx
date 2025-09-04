import React, { useEffect, useState } from 'react';
import { useParams, Link, useActionData, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styling/DriverShow1.css';
import { getCurrentCoords } from '../utils/geolocation';
import DriverRating from './DriverRating';
import { useAuth } from '../Contexts/AuthContext';

const DriverShow1 = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    console.log("🎉 DriverShow1 mounted");
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/v1/driver/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (isMounted) {
          // Get the saved status from localStorage first
          const savedStatus = localStorage.getItem(`driver_${id}_online_status`);
          
          const driverData = {
            ...response.data,
            // Use localStorage value if it exists, otherwise use API value, otherwise default to false
            isOnline: savedStatus !== null ? savedStatus === 'true' : (response.data.isOnline ?? false)
          };
          
          setDriver(driverData);
          console.log("Driver loaded - isOnline:", driverData.isOnline);
          console.log("From localStorage:", savedStatus);
          console.log("From API:", response.data.isOnline);
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

  // Save to localStorage whenever isOnline changes
  useEffect(() => {
    if (driver?.isOnline !== undefined) {
      localStorage.setItem(`driver_${id}_online_status`, driver.isOnline.toString());
      console.log("Saved to localStorage:", driver.isOnline);
    }
  }, [driver?.isOnline, id]);

  const goOnline = async (coords) => {
    try {
      // Update state immediately (optimistic update)
      setDriver(prev => ({ ...prev, isOnline: true }));
      
      // Make API call
      await axios.put(
        `http://localhost:8080/api/v1/drivers/${id}/status`,
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
      
      console.log("Successfully went online");
      console.log("Longitude:", coords.longitude);
      console.log("Latitude:", coords.latitude);
    } catch (err) {
      console.error("Failed to go online:", err);
      // Revert on error
      setDriver(prev => ({ ...prev, isOnline: false }));
      alert("Could not go online.");
    }
  };

  if (user === undefined) {
    return <div>Loading authentication...</div>;
  }
  
  if (user !== undefined && user?.userId !== id) {
    console.log("❌ ID'S DO NOT MATCH ");
    console.log("userId: ", user?.userId);
    console.log("route id: ", id);
    return <Navigate to="/" replace />;
  }

  const goOffline = async () => {
    try {
      // Update state immediately (optimistic update)
      setDriver(prev => ({ ...prev, isOnline: false }));
      
      // Make API call
      await axios.put(
        `http://localhost:8080/api/v1/drivers/${id}/status`,
        {
          isOnline: false
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Successfully went offline");
    } catch (err) {
      console.error("Failed to go offline:", err);
      // Revert on error
      setDriver(prev => ({ ...prev, isOnline: true }));
      alert("Could not go offline.");
    }
  };

  const toggleStatus = async () => {
    if (loading || !driver) return;
    setLoading(true);

    try {
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
    } catch (err) {
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
      const res = await fetch(`/api/v1/drivers/stripe/onboard?email=${driverEmail}&driverId=${driverId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error('Stripe Onboarding request failed')
      }

      const url = await res.text();
      window.location.href = url;
    } catch (err) {
      console.log("stripe onboarding error: ", err)
      alert("failed to redirect to Stripe Onboarding")
    }
  };

  const handleLogout = () => {
    logout();
    console.log("🔐 LOGOUT SUCCESSFUL 🔏");
    navigate("/");
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
                className={`toggle-button ${driver.isOnline ? "online" : "offline"} ${loading ? "disabled" : ""}`}
                style={{ 
                  opacity: loading ? 0.6 : 1, 
                  cursor: loading ? "not-allowed" : "pointer",
                  pointerEvents: loading ? "none" : "auto"
                }}
              >
                <div className="toggle-thumb"></div>
              </div>
              {loading && <p style={{fontSize: '12px', color: '#666'}}>Updating...</p>}
            </div>

            <div className='Driver-Profile-Button-Section'>
              <div className='Driver-Button-Profile'><Link to={`/driver/home/${id}`}>View Rides</Link></div>
              <div className='Driver-Button-Profile'><Link to={`/edit/driver/${id}/info`}>Edit Profile</Link></div>
              <button className='Driver-Button-Profile' onClick={onboardStripe}>Finish Stripe Setup</button>
              <div className='Driver-Button-Profile'><Link to={"/test"}>Test</Link></div>
              <button onClick={handleLogout} className='Driver-Button-Profile'>Logout</button>
              <div className="Driver-Button-Profile">
                <button
                  className="Rate-Button"
                  onClick={() => setShowRatingPopup(prev => !prev)}
                >
                  {showRatingPopup ? "Close" : "Rate Driver"}
                </button>

                {showRatingPopup && (
                  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
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