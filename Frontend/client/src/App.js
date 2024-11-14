import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Test from './Components/Test';
import AllDrivers from './Components/AllDrivers';
import DriverShow1 from './Components/DriverShow1';
import LoginDriver from './Components/LoginDriver';
import RegisterDriverLandingPage from './Components/RegisterDriverLandingPage';

function App() {
  return (
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/driver/all" element={<AllDrivers />} />
        <Route path="/one/driver/:id" element={<DriverShow1 />} />
        <Route path="/login" element={<LoginDriver />} />
        <Route path="*" element={<AllDrivers />}/>
        <Route path="/" element={<RegisterDriverLandingPage />} />
      </Routes>
  );
}

export default App;

