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
            const idToken = response.credential;  // This is the Google ID token (JWT)
            console.log("Received Google ID Token:", idToken);  // Log the actual token for debugging
    
            const decodedToken = jwtDecode(idToken);
            const data = {
                googleId: idToken,  // Send the Google ID token, not the Client ID
                email: decodedToken.email
            };
    
            try {
                const res = await axios.post(`http://localhost:8080/signup/${role}/googleId`, data, { withCredentials: true });
                console.log("Response from backend:", res.data);
                console.log(data.email + " " + data.googleId + " google id and email")
    
                if (res.data.exists) {
                    if (role === "driver") {
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
