import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Test from './Components/Test';

function App() {
  return (
      <Routes>
        <Route path="/test" element={<Test />} />
      </Routes>
  );
}

export default App;

