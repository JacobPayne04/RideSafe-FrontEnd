import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Test from './Components/Test';
import Driver from './Components/Driver';
import OneDriver from './Components/OneDriver';

function App() {
  return (
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/one/driver/:id" element={<OneDriver />} />
      </Routes>
  );
}

export default App;

