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
            const idToken = response.credential;  // Should be a full JWT, not just an ID
            console.log("Received Google ID Token:", idToken); // Debugging
            
            const decodedToken = jwtDecode(idToken);
    
            const data = {
                googleId: idToken,  // Send full JWT, not just sub ID
                email: decodedToken.email
            };
    
            try {
                const res = await axios.post(`http://localhost:8080/signup/${role}/googleId`, data, { withCredentials: true });
                console.log("Response from backend:", res.data);
    
                if (res.data.exists) {
                    navigate(`/driver/home/${res.data.driverId}`);
                } else {
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
