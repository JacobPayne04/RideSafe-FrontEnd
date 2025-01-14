import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AllDrivers from './Components/AllDrivers';
import DriverShow1 from './Components/DriverShow1';
import LoginDriver from './Components/LoginDriver';
import RegisterDriverLandingPage from './Components/RegisterDriverLandingPage';
import LoginLandingPage from './Components/LoginLandingPage';
import RegisterDriver from './Components/RegisterDriver';
import RegisterPassenger from './Components/RegisterPassenger';
import LoginPassenger from './Components/LoginPassenger';
import RideForm from './Components/RideForm';
import PassengerShow1 from './Components/PassengerShow1';


function App() {
  return (
    <Routes>
      <Route path="/driver/all" element={<AllDrivers />} />
      <Route path="/one/driver/:id" element={<DriverShow1 />} />
      <Route path="/login" element={<LoginLandingPage />} />
      <Route path="/login/driver" element={<LoginDriver />} />
      <Route path="*" element={<AllDrivers />} />
      <Route path="/" element={<RegisterDriverLandingPage />} />
      <Route path="/register/driver" element={<RegisterDriver />} />
      <Route path="/register/passenger" element={<RegisterPassenger />} />
      <Route path="/login/passenger" element={<LoginPassenger />} />
      <Route path="/passenger/:passengerId/book/ride/driver/:driverId" element={<RideForm/>}/>
      <Route path ="/Passenger/home" element={<PassengerShow1 />} />

      {/* Add a new route here for passenger homepage */}
      {/* Add a new route here for driver homepage */}
      {/* add route here for pasenger/driver settings*/}
      {/* add route here for pasenger/driver profile page*/}
      {/* add a route here for Driver drives history  */}
      {/* add a route here for passenger rides history  */}
    </Routes>
  );
}

export default App;

