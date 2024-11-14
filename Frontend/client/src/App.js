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

function App() {
  return (
      <Routes>
        <Route path="/driver/all" element={<AllDrivers />} />
        <Route path="/one/driver/:id" element={<DriverShow1 />} />
        <Route path="/login" element={<LoginLandingPage />} />
        <Route path="/login/driver" element={<LoginDriver />} />
        <Route path="*" element={<AllDrivers />}/>
        <Route path="/" element={<RegisterDriverLandingPage />} />
        <Route path="/register/driver" element={<RegisterDriver />} />
      </Routes>
  );
}

export default App;

