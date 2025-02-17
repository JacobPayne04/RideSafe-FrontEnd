import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';


const GoogleSignIn = () => {

    const navigate = useNavigate()
    const { role } = useParams()

    const onSuccess = (response) => {

        const { email, googleId } = response.profileObj;
        const data = { email, googleId }

        axios.post(`/http://localhost:8080/signin/${role}/google`, data)
            .then(() => {
                console.log("Google Sign In Successful: ", data)
            })
            .catch((error) => console.error("There was an error: ", error))
    }

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