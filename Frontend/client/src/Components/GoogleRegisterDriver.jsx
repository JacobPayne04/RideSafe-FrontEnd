import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleRegisterDriver = () => {
    const navigate = useNavigate();

    // Retrieve stored user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const GoogleEmail = userData.email || '';
    const GoogleID = userData.googleId || '';

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            licensePlate: '',
            email: GoogleEmail,
            googleId: GoogleID
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            licensePlate: Yup.string().required('License Plate is required'),
        }),

        onSubmit: async (values) => {
            try {
                console.log("Submitting data:", values);
                const response = await axios.post("http://localhost:8080/new", values, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Driver created:", response.data);
             
        
                const driverId = response.data.id; // Ensure API returns _id
                if (!driverId) {
                    console.error("🚨 Error: No driver ID returned from API.");
                    return;
                }
        
                localStorage.setItem("driverId", driverId);
                const driverEmail = response.data.email;
                localStorage.setItem('driverEmail', driverEmail)
                console.log("Navigating to:", `/driver/${driverId}/verification/account/setup`);
        
                navigate(`/driver/${driverId}/verification/account/setup`);
            } catch (error) {
                console.error('There was an error!', error.response ? error.response.data : error);
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Complete Google Sign-Up</h2>
            <input name="firstName" placeholder="First Name" value={formik.values.firstName}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.firstName && formik.errors.firstName && <div>{formik.errors.firstName}</div>}

            <input name="lastName" placeholder="Last Name" value={formik.values.lastName}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.lastName && formik.errors.lastName && <div>{formik.errors.lastName}</div>}

            <p>Email: <strong>{GoogleEmail}</strong></p>
            <p>googleId: <strong>{GoogleID}</strong></p>

            <input name="licensePlate" placeholder="License Plate" value={formik.values.licensePlate}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.licensePlate && formik.errors.licensePlate && <div>{formik.errors.licensePlate}</div>}

            <button type="submit">Complete Sign-Up</button>
        </form>
    );
};

export default GoogleRegisterDriver;
