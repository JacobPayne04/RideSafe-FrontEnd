import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import ViewRideById from './Components/ViewRideById';
import DriverHomePage from './Components/DriverHomePage';
import ViewOneRideById from './Components/ViewOneRideById';
import ViewRideGoogleMaps from './Components/ViewRideGoogleMaps';
import GoogleRegisterPassenger from './Components/GoogleRegisterPassenger';
import GoogleRegisterDriver from './Components/GoogleRegisterDriver';
import GoogleSignIn from './Components/GoogleSignIn';



function App() {
  const clientId = process.env.REACT_APP_CLIENTID

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
        <Route path="/passenger/:passengerId/book/ride/driver/:driverId" element={<RideForm />} />
        <Route path="/Passenger/home" element={<PassengerShow1 />} />
        <Route path="/ride/:rideId" element={<ViewRideById />} />
        <Route path="/driver/home/:driverId" element={<DriverHomePage />} />
        <Route path="/view/ongoing/ride/:rideId" element={<ViewOneRideById />} />
        <Route path="/view/ride/googlemaps" element={<ViewRideGoogleMaps />} />
        <Route path="register/passenger/google" element={<GoogleRegisterPassenger />} />
        <Route path="register/driver/google" element={<GoogleRegisterDriver />} />
        <Route path="/google/signin/:role" element={<GoogleSignIn />} />

        {/* Add a new route here for passenger homepage */}
        {/* Add a new route here for driver homepage */}
        {/* add route here for pasenger/driver settings*/}
        {/* add route here for pasenger/driver profile page*/}
        {/* add a route here for Driver drives history  */}
        {/* add a route here for passenger rides history  */}
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;

