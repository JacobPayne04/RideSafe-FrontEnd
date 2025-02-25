import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const clientId = process.env.REACT_APP_CLIENTID;

const GoogleSignIn = () => {
    const navigate = useNavigate();
    const { role } = useParams();

    const onSuccess = async (response) => {
        if (response.credential) {
            const decodedToken = jwtDecode(response.credential);
            const { email, sub: googleId } = decodedToken;
            const data = { email, googleId, idToken: response.credential };// Send the actual ID token
            
    
            localStorage.setItem("user", JSON.stringify(data));
    
            try {
                const res = await axios.post(`http://localhost:8080/signup/${role}/googleId`, data);
                if (res.data.exists) {
                    const driverId = localStorage.getItem("driverId");
                    console.log("Driver ID:", driverId + {role});
                    navigate(`/driver/home/${driverId}`);
                } else {
                    console.log("User does not exist in the database");
                }
            } catch (error) {
                console.error("Error during Google Sign-In process:", error);
                navigate(`/register/${role}/google`);
            }
        }
    };
    

    return (
        <div>
            <h2>Google Sign In for {role}</h2>
            <button onClick={() => navigate(`/register/${role}/google`)}>this is big button</button>

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
