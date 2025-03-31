import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styling/DriverShow1.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        console.log(response.data);
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

  const toggleStatus = async () => {
    if (loading) return;
    const newStatus = !driver.online; // Use the correct property name
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:8080/${id}/status`,
        null,
        { params: { isOnline: newStatus } } // Assuming the backend expects 'isOnline'
      );
      setDriver((prevDriver) => ({
        ...prevDriver,
        online: newStatus, // Update the correct property in state
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
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
          <img src="https://i0.wp.com/toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png" className='Default-Profile-Picture' />


          <div>
            <div className='First-Last-Name-Section'>
              <p className='First-Name-Driver'>{driver.firstName}</p>
              <p className='Last-Name-Driver'>{driver.lastName}</p>
              <p> driver Id: {driver.id}</p>
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
              <div>
                <Link to={"driver setting page"}>Settings</Link>
              </div>
            </div>
              <div>
                <Link to={`/driver/home/${id}`}>View Rides</Link>
              </div>
              <div>
                <Link to={`/edit/driver/${id}/info`}>Edit Profile</Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default DriverShow1;