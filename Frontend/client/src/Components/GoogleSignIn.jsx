import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosSecure from '../Security/axiosSecure';
import { jwtDecode } from 'jwt-decode';
import '../Styling/GoogleSignIn.css'
import { useAuth } from '../Contexts/AuthContext';

const clientId = process.env.REACT_APP_CLIENTID;

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { login } = useAuth();
  
  const onSuccess = async (response) => {
    if (response.credential) {
      const idToken = response.credential;
      const decodedToken = jwtDecode(idToken);

      localStorage.setItem("userEmail", decodedToken.email);

      const data = {
        googleId: idToken,
        email: decodedToken.email
      };

      try {
        const res = await axiosSecure.post(`/signup/${role}/googleId`, data, { withCredentials: true });

        if(res.data.token) {
          login(res.data.token)
        }
        if (res.data.exists) {
          if (role === "driver") {
            localStorage.setItem('driverEmail', res.data.email)
            localStorage.setItem("driverId", res.data.driverId);
            navigate(`/one/driver/${res.data.driverId}`);
          } else {
            localStorage.setItem("passengerId", res.data.passengerId);
            navigate(`/Passenger/home`);
          }
        } else {
          localStorage.setItem("user", JSON.stringify(data));
          navigate(`/register/${role}/google`);
        }
      } catch (error) {
        console.error("Error during Google Sign-In process:", error);
      }
    }
  };

  const getRoleFeatures = () => {
    if (role === 'driver') {
      return [
        { icon: '🚗', text: 'Earn money by offering rides' },
        { icon: '📍', text: 'Set your own routes and schedule' },
        { icon: '💰', text: 'Get paid instantly after each ride' },
        { icon: '⭐', text: 'Build your driver rating' }
      ];
    } else {
      return [
        { icon: '🎯', text: 'Find rides that match your route' },
        { icon: '💸', text: 'Split costs with other passengers' },
        { icon: '🕒', text: 'Flexible pickup times' },
        { icon: '🛡️', text: 'Safe and verified drivers' }
      ];
    }
  };

  return (
    <div className="google-signin-container">
      <div className="test-button-container">
        <button className="test-button">
          <Link to="/test" style={{ textDecoration: 'none', color: 'white' }}>TEST</Link>
        </button>
      </div>

      <div className="signin-card">
        <h2 className="signin-title">
          Welcome
          <span className="role-highlight">{role}</span>
        </h2>

        <p className="signin-description">
          {role === 'driver' 
            ? 'Join our driver community and start earning by sharing rides with passengers going your way.'
            : 'Find affordable rides and connect with drivers heading to your destination.'
          }
        </p>

        <div className="google-login-wrapper">
          <div className="google-login-container">
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>

        <div className="features-section">
          <h3 className="features-title">
            {role === 'driver' ? 'Driver Benefits' : 'Passenger Benefits'}
          </h3>
          <div className="features-list">
            {getRoleFeatures().map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        <div className="security-notice">
          <span className="security-icon">🔒</span>
          Your information is secure. We use Google's trusted authentication to protect your account and never store your password.
        </div>
      </div>
    </div>
  );
}

export default GoogleSignIn;