import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


const GoogleSignIn = () => {

    const navigate = useNavigate()
    const { role } = useParams()

    const onSuccess = (response) => {
        console.log("Google response:", response);

        if (response.credential) {
            const decodedToken = jwtDecode(response.credential);
            console.log("Decoded Token:", decodedToken);

            // Now you can extract the user's email and ID from the decoded token
            const { email, sub: googleId } = decodedToken;
            const data = { email, googleId };

            localStorage.setItem("user", JSON.stringify(data));

            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user.email, user.googleId);

            // Send this data to your server
            axios.post(`http://localhost:8080/signin/${role}/google`, data)
                .then(() => {
                    console.log("Google Sign-In Successful: ", data);
                    // Navigate or proceed further
                })
                .catch((error) => console.error("There was an error: ", error));
        } else {
            console.error("Credential missing in the response.");
        }
    };

    const onFailure = (response) => {
        console.error("Google Sign-In Failed: ", response)
    }

    return (
        <div>
            <h2>Google Sign In for {role}</h2>
            <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default GoogleSignIn