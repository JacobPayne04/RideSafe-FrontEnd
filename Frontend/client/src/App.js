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
import DriverHomePage from './Components/DriverHomePage';
import ViewRideGoogleMaps from './Components/ViewRideGoogleMaps';
import GoogleRegisterPassenger from './Components/GoogleRegisterPassenger';
import GoogleRegisterDriver from './Components/GoogleRegisterDriver';
import GoogleSignIn from './Components/GoogleSignIn';
import AdminHome from './Components/AdminHome';



function App() {
  const clientId = process.env.REACT_APP_CLIENTID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        {/* Base Routes */}
        <Route path="*" element={<AllDrivers />} />
        <Route path="/" element={<RegisterDriverLandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={ <AdminHome/> }/>
        
        {/* Driver Routes */}
        <Route path="/drivers/all" element={<AllDrivers />} />
        <Route path="/one/driver/:id" element={<DriverShow1 />} />
        <Route path="/login" element={<LoginLandingPage />} />
        <Route path="/login/driver" element={<LoginDriver />} />
        <Route path="/register/driver" element={<RegisterDriver />} />
        <Route path="register/driver/google" element={<GoogleRegisterDriver />} />
        <Route path="/driver/home/:driverId" element={<DriverHomePage />} />

        {/* Passenger Routes */}
        <Route path="/register/passenger" element={<RegisterPassenger />} />
        <Route path="register/passenger/google" element={<GoogleRegisterPassenger />} />
        <Route path="/login/passenger" element={<LoginPassenger />} />
        <Route path="/Passenger/home" element={<PassengerShow1 />} />

        {/* Ride Routes */}
        <Route path="/passenger/:passengerId/book/ride/driver/:driverId" element={<RideForm />} />
        <Route path="/view/ride/googlemaps" element={<ViewRideGoogleMaps />} />

        {/* Google API Routes */}
        <Route path="/google/signin/:role" element={ <GoogleSignIn/> } />
        
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;

