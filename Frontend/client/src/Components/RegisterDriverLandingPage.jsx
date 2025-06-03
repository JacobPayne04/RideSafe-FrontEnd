import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Styling/RegisterDriverLandingPage.css'; // Import the external CSS file

const RegisterDriverLandingPage = () => {
    const navigate = useNavigate();
    const [showSignInPopup, setShowSignInPopup] = useState(false);

    const handleDriverRegister = () => {
        navigate('/register/driver');
    };

    const handlePassengerRegister = () => {
        navigate('/register/passenger');
    };

    const handleGoogleSignInPopUp = (role) => {
        setShowSignInPopup(true)
    }

    const handleGoogleSignInNav = (role) => {
        navigate(`/google/signin/${role}`)
    }

    return (
        <div className="register-landing-container">
            {/* Test Button in top-right corner */}
            <div className="test-button-container">
                <button className="test-button">
                    <Link to="/test">TEST</Link>
                </button>
            </div>

            {/* Main registration card */}
            <div className="register-main-card">
                <h1 className="register-main-title">
                    Join Our Community Today!
                </h1>
                
                <p className="register-description">
                    Choose your role and start your journey with us. Whether you're looking to drive or ride, we've got you covered.
                </p>

                {/* Registration options */}
                <div className="register-options">
                    <div onClick={handleDriverRegister} className="register-option-card driver-card">
                        <div className="option-icon">🚗</div>
                        <div className="option-content">
                            <h3>Register as Driver</h3>
                            <p>Start earning by giving rides to passengers</p>
                        </div>
                    </div>

                    <div onClick={handlePassengerRegister} className="register-option-card passenger-card">
                        <div className="option-icon">🧳</div>
                        <div className="option-content">
                            <h3>Register as Passenger</h3>
                            <p>Find convenient rides to your destination</p>
                        </div>
                    </div>
                </div>

                {/* Google Sign In section */}
                <div className="google-signin-section">
                    <div className="section-divider">
                        <span>or</span>
                    </div>
                    <button onClick={handleGoogleSignInPopUp} className='google-signin-btn'>
                        <span className="google-icon">🌐</span>
                        Sign In With Google
                    </button>
                </div>

                {/* Login prompts */}
                <div className="login-prompts-section">
                    <div className="features-title">Already have an account?</div>
                    <div className="login-options">
                        <div className="login-option">
                            <span>Already a Driver?</span>
                            <button className="login-link-btn">
                                <Link to="/login/driver">Login as Driver</Link>
                            </button>
                        </div>
                        <div className="login-option">
                            <span>Already a Passenger?</span>
                            <button className="login-link-btn">
                                <Link to="/login/passenger">Login as Passenger</Link>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features section */}
                <div className="features-section">
                    <div className="features-title">Why Choose Us?</div>
                    <div className="features-list">
                        <div className="feature-item">
                            <span className="feature-icon">🛡️</span>
                            Safe and secure rides with verified drivers
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">💰</span>
                            Competitive pricing and flexible payment options
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📱</span>
                            Easy-to-use mobile app with real-time tracking
                        </div>
                    </div>
                </div>

                {/* Security notice */}
                <div className="security-notice">
                    <span className="security-icon">🔒</span>
                    Your privacy and security are our top priorities. All data is encrypted and protected.
                </div>
            </div>

            {/* Google Sign In Popup */}
            {showSignInPopup && (
                <div className='popup-overlay'>
                    <div className='popup-content'>
                        <h3 className="popup-title">Choose Your Role</h3>
                        <p className="popup-description">Google Sign In As A:</p>
                        <div className='popup-buttons'>
                            <button className='popup-option popup-driver' onClick={() => handleGoogleSignInNav('driver')}>
                                <span className="popup-icon">🚗</span>
                                Driver
                            </button>
                            <button className='popup-option popup-passenger' onClick={() => handleGoogleSignInNav('passenger')}>
                                <span className="popup-icon">🧳</span>
                                Passenger
                            </button>
                        </div>
                        <button className="popup-close" onClick={() => setShowSignInPopup(false)}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterDriverLandingPage;