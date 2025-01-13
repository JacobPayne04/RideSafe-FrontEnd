import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Styling/RegisterDriverLandingPage.css'; // Import the external CSS file

const RegisterDriverLandingPage = () => {
    const navigate = useNavigate();

    const handleDriverRegister = () => {
        navigate('/register/driver');
    };

    const handlePassengerRegister = () => {
        navigate('/register/passenger');
    };

    return (
        <div className="register-container">
            <h1 className="register-header">Register to be Driver or Passenger today!</h1>
            <div onClick={handleDriverRegister} className="register-card">
                🚗 Register to be a Driver
            </div>
            <div onClick={handlePassengerRegister} className="register-card">
                🧳 Register to be a Passenger
            </div>
            <div className="login-prompt">
                <p>Already a Driver? <button className="register-card"><Link to="/login/driver">Login Driver</Link></button></p>
                <p>Already a passenger? <button className="register-card"><Link to="/login/passenger">Login Passenger</Link></button></p>
            </div>
        </div>
    );
};

export default RegisterDriverLandingPage;
