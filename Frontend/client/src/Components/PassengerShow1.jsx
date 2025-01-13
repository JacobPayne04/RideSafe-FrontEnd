import React, { useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import  '../Styling/PassengerShow1.css'
import { useState } from 'react'
const PassengerShow1 = () => {




const [onlineDrivers, setOnlineDrivers] = useState([]);

useEffect(()=> {
  const fetchOnlineDrivers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/online/drivers');
        setOnlineDrivers(res.data);
      } catch(error) {
        console.error('❌ Error in fetching online drivers:', error);
      }


  }
  fetchOnlineDrivers();
},[]);


  return (
    <div className="profile-container">
    {onlineDrivers.map((driver) => (
      <div className="profile-card" key={driver.id}>
        <div className="profile-pic-placeholder">Profile Pic</div>
        <div className="profile-info">
          <p>{driver.firstName} {driver.lastName}</p>
          <p className="invisible-id">{driver.id}</p>
        </div>
      </div>
    ))}
  </div>
  )
}

export default PassengerShow1