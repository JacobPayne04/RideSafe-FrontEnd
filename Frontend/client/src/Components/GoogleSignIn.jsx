import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const clientId = process.env.REACT_APP_CLIENTID;

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const { role } = useParams();


  const onSuccess = async (response) => {
    if (response.credential) {
      const idToken = response.credential;
      const decodedToken = jwtDecode(idToken); // ⬅️ Now it exists

      // ✅ Set email here, AFTER it's defined
      localStorage.setItem("userEmail", decodedToken.email);

      const data = {
        googleId: idToken,
        email: decodedToken.email
      };

      try {
        const res = await axios.post(`http://localhost:8080/signup/${role}/googleId`, data, { withCredentials: true });

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









  return (
    <div>
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
      <h2>Google Sign In for {role}</h2>

      <GoogleLogin
        clientId={clientId}
        buttonText="Sign in with Google"
        onSuccess={onSuccess}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}

export default GoogleSignIn;
