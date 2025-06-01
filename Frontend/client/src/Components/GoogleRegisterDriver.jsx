import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../Styling/GoogleRegisterDriver.css"

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
  <div className="google-signup-container">
    <form onSubmit={formik.handleSubmit} className="google-signup-form">
      <h2 className="google-signup-heading">Complete Google Sign-Up</h2>
      
      <input 
        name="firstName" 
        placeholder="First Name" 
        value={formik.values.firstName}
        onChange={formik.handleChange} 
        onBlur={formik.handleBlur}
        className="google-signup-input"
      />
      {formik.touched.firstName && formik.errors.firstName && (
        <div className="error-message">{formik.errors.firstName}</div>
      )}

      <input 
        name="lastName" 
        placeholder="Last Name" 
        value={formik.values.lastName}
        onChange={formik.handleChange} 
        onBlur={formik.handleBlur}
        className="google-signup-input"
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <div className="error-message">{formik.errors.lastName}</div>
      )}

      <p className="google-info-text">Email: <strong>{GoogleEmail}</strong></p>

      <input 
        name="licensePlate" 
        placeholder="License Plate" 
        value={formik.values.licensePlate}
        onChange={formik.handleChange} 
        onBlur={formik.handleBlur}
        className="google-signup-input"
      />
      {formik.touched.licensePlate && formik.errors.licensePlate && (
        <div className="error-message">{formik.errors.licensePlate}</div>
      )}

      <button type="submit" className="google-signup-button">
        Complete Sign-Up
      </button>
    </form>

    <div className="test-button-container">
      <button
        className="test-button"
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(0.98)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.3)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
        }}
      >
        <Link to="/test" className="test-link">TEST</Link>
      </button>
    </div>
  </div>
);
}

export default GoogleRegisterDriver;
