import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import '../Styling/RideForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RideForm = () => {

    const navigate = useNavigate();
    const { passengerId, driverId } = useParams();

    const formik = useFormik({
        initialValues: {
            passengerId: passengerId || '',
            driverId: driverId || '',
            fromLocation: '',
            toLocation: '',
            status: 'PENDING',
        },

        validationSchema: Yup.object({
            passengerId: Yup.string().required('Passenger ID is required'),
            DriverId: Yup.string().required('Driver ID is required'),
            fromLocation: Yup.string().required('From Location is required'),
            toLocation: Yup.string().required('Destination Location is required'),
            status: Yup.string().required('Ride status is required')
        }),

        onSubmit: (values) => {
            console.log("form submitted", values);
            axios.post('http://localhost:8080/rides/save', values)
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
                <h2 className="form-title">Where are we going today?</h2>
                <input
                    className="form-input"
                    name="passengerId"
                    type="hidden"
                    placeholder="Passenger ID"
                    value={formik.values.passengerId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    readOnly={!!passengerId} // Read-only if pre-filled from params
                />
                {formik.touched.passengerId && formik.errors.passengerId && (
                    <div className="error-message">{formik.errors.passengerId}</div>
                )}

                <input
                    className="form-input"
                    name="driverId"
                    type="hidden"
                    placeholder="Driver ID"
                    value={formik.values.driverId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    readOnly={!!driverId} // Read-only if pre-filled from params
                />
                {formik.touched.driverId && formik.errors.driverId && (
                    <div className="error-message">{formik.errors.driverId}</div>
                )}
                    <p>Pickup Location</p>
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
                <p>Dropoff Location</p>
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
                    type="hidden"
                    placeholder="ride status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.status && formik.errors.status && (
                    <div className="error-message">{formik.errors.status}</div>
                )}

                <button type="submit"  className="form-button">
                    Book Ride
                </button>
            </form>
        </div>
    )
}

export default RideForm