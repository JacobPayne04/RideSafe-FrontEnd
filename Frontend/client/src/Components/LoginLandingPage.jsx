import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

            <div>
                <button
                    style={{
                        cursor: 'pointer',
                        padding: '15px 30px',
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(0.98)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.3)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
                    }}
                >
                    <Link to="/test" style={{ textDecoration: 'none', color: 'white' }}>TEST</Link>
                </button>
            </div>

        </div>
    )
}

export default LoginLandingPage