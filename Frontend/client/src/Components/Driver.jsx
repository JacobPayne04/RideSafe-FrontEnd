import React, { useEffect } from 'react'
import { useState } from 'react'
import '../Styling/Driver.css'
import axios from 'axios'


const Driver = () => {
  const [drivers,setDrivers] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:8080/drivers')
    .then(response =>{
      setDrivers(response.data);
      console.log('Response from server:', response.data)
    })
    .catch(error => {
      console.log("There was an error!",error);
    });
  },[]);



  return (
    <div>
      <h1>All Drivers</h1>
      <ul className="driver-list">
        {drivers.map(driver => (
          <li key={driver._id} className="driver-details">
            <span className="driver-name">
              {driver.firstName} {driver.lastName}
            </span>
            <span className="driver-email">{driver.email}</span>
            <span className="driver-license">{driver.licensePlate}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Driver