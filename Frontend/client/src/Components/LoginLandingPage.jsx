import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/LoginLandingPage.css'


const LoginLandingPage = () => {

    const navigate = useNavigate();

    const handleDriverLogin = () => {
        navigate('/login/driver');
    };

    const handlePassengerLogin = () => {
        navigate('/login/passenger');
    };

    return (
        <div className="login-container">
            <h1 className="login-header">Login to be Driver or Passenger today!</h1>
            <div onClick={handleDriverLogin} className="login-card">
                🚗 Login as a Driver
            </div>
            <div onClick={handlePassengerLogin} className="login-card">
                🧳 Login as a Passenger
            </div>
            
        </div>
    )
}

export default LoginLandingPage