import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const clientId = process.env.REACT_APP_CLIENTID;



const GoogleSignIn = () => {

    const navigate = useNavigate()
    const { role } = useParams()

    const onSuccess = async (response) => {
    const onSuccess = async (response) => {
        console.log("Google response:", response);

        if (response.credential) {
            const decodedToken = jwtDecode(response.credential);
            console.log("Decoded Token:", decodedToken);

            const { email, sub: googleId } = decodedToken;
            const data = { email, googleId };

            localStorage.setItem("user", JSON.stringify(data));

            console.log("Stored User Data:", JSON.parse(localStorage.getItem("user")));

            try {
                // Send user data to backend
                await axios.post(`http://localhost:8080/signup/${role}/google`, data);
                console.log("Google Sign-In Successful: ", data);

                // Check if account exists
                const response = await axios.post(`http://localhost:8080/signup/${role}/googleId`, data);
                
                if (response.data.exists) { 
                    const driverId = localStorage.getItem("driverId");
                    navigate(`/driver/home/${driverId}`);
                } else {
                    navigate(`/register/${role}/google`);
                }
            } catch (error) {
                console.error("Error during Google Sign-In process:", error);
                navigate(`/register/${role}/google`);
            }
            console.log("Stored User Data:", JSON.parse(localStorage.getItem("user")));

            try {
                // Send user data to backend
                await axios.post(`http://localhost:8080/signup/${role}/google`, data);
                console.log("Google Sign-In Successful: ", data);

                // Check if account exists
                const response = await axios.post(`http://localhost:8080/signup/${role}/googleId`, data);
                
                if (response.data.exists) { 
                    const driverId = localStorage.getItem("driverId");
                    navigate(`/driver/home/${driverId}`);
                } else {
                    navigate(`/register/${role}/google`);
                }
            } catch (error) {
                console.error("Error during Google Sign-In process:", error);
            }
        } else {
            console.error("Credential missing in the response.");
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
    )
}

export default GoogleSignIn