import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import '../Styling/RideForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RideForm = () => {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            passengerId: '',
            DriverId: '',
            fromLocation: '',
            toLocation: '',
            status: '',
        },

        validationSchema: Yup.object({
            passengerId: Yup.string().required('Passenger ID is required'),
            DriverId: Yup.string().required('Driver ID is required'),
            fromLocation: Yup.string().required('From Location is required'),
            toLocation: Yup.string().required('Destination Location is required'),
            status: Yup.string().required('Ride status is required')
        }),

        onSubmit: (values) => {
            axios
                .post('http://localhost:8080/new/ride', values)
                .then((response) => {
                    const passengerId = response.data.id;
                    navigate(`/Passenger/home`);
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        },
    });

  return (
        <div className="form-container">
    <form onSubmit={formik.handleSubmit} className="form-content">
        <h2 className="form-title">Book a Ride</h2>
        <input
            className="form-input"
            name="passengerId"
            type="text"
            placeholder="Passenger ID"
            value={formik.values.passengerId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.passengerId && formik.errors.passengerId && (
            <div className="error-message">{formik.errors.passengerId}</div>
        )}

        <input
            className="form-input"
            name="DriverId"
            type="text"
            placeholder="Driver ID"
            value={formik.values.DriverId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.DriverId && formik.errors.DriverId && (
            <div className="error-message">{formik.errors.DriverId}</div>
        )}

        <input
            className="form-input"
            name="fromLocation"
            type="text"
            placeholder="FromLocation"
            value={formik.values.fromLocation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.fromLocation && formik.errors.fromLocation && (
            <div className="error-message">{formik.errors.fromLocation}</div>
        )}

        <input
            className="form-input"
            name="toLocation"
            type="text"
            placeholder="ToLocation"
            value={formik.values.toLocation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.toLocation && formik.errors.toLocation && (
            <div className="error-message">{formik.errors.toLocation}</div>
        )}

        <input
            className="form-input"
            name="status"
            type="text"
            placeholder="ride status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.status && formik.errors.status && (
            <div className="error-message">{formik.errors.status}</div>
        )}

        <button type="submit" className="form-button">
            Book Ride
        </button>
    </form>
</div>
  )
}

export default RideForm