import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import '../Styling/RideForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Ensure to load the Google Maps API script for Autocomplete
const RideForm = () => {
    const [google, setGoogle] = useState(null); // State to store Google Maps API
    const navigate = useNavigate();
    const { passengerId, driverId } = useParams();

    // Initialize Google Maps API
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => setGoogle(window.google); // Load the Google API
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            passengerId: passengerId || '',
            driverId: driverId || '',
            fromLocation: '',
            toLocation: '',
            fromLatitude: '',
            fromLongitude: '',
            toLatitude: '',
            toLongitude: '',
            status: 'PENDING',
            passengerCount: '1', // Default value set to 1
        },

        validationSchema: Yup.object({
            passengerId: Yup.string().required('Passenger ID is required'),
            driverId: Yup.string().required('Driver ID is required'),
            fromLocation: Yup.string().required('From Location is required'),
            toLocation: Yup.string().required('Destination Location is required'),
            status: Yup.string().required('Ride status is required'),
            passengerCount: Yup.number()
                .required('Passenger count is required')
                .min(1, 'Must be at least 1')
                .max(5, 'Cannot exceed 5 passengers'),
        }),

        onSubmit: (values) => {
            console.log("form submitted", values);
            axios.post('http://localhost:8080/rides/save', values)
                .then((response) => {
                    const passengerId = response.data.id;
                    const rideId = response.data.id;
                    localStorage.setItem('rideId', rideId);
                    navigate(`/Passenger/home`);
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        },
    });

    // Function to initialize Autocomplete on the location fields
    const initAutocomplete = () => {
        if (google) {
            const options = {
                types: ['geocode'], // Restrict search to geocoding (addresses)
            };

            // Autocomplete for 'From Location'
            const fromInput = document.getElementById('fromLocation');
            const fromAutocomplete = new google.maps.places.Autocomplete(fromInput, options);
            fromAutocomplete.addListener('place_changed', () => {
                const place = fromAutocomplete.getPlace();
                if (place.geometry) {
                    formik.setFieldValue('fromLatitude', place.geometry.location.lat());
                    formik.setFieldValue('fromLongitude', place.geometry.location.lng());
                    formik.setFieldValue('fromLocation', place.formatted_address);
                }
            });

            // Autocomplete for 'To Location'
            const toInput = document.getElementById('toLocation');
            const toAutocomplete = new google.maps.places.Autocomplete(toInput, options);
            toAutocomplete.addListener('place_changed', () => {
                const place = toAutocomplete.getPlace();
                if (place.geometry) {
                    formik.setFieldValue('toLatitude', place.geometry.location.lat());
                    formik.setFieldValue('toLongitude', place.geometry.location.lng());
                    formik.setFieldValue('toLocation', place.formatted_address);
                }
            });
        }
    };

    // Initialize Google Autocomplete after API has loaded
    useEffect(() => {
        if (google) {
            initAutocomplete();
        }
    }, [google]);

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
                    id="fromLocation"
                    className="form-input"
                    name="fromLocation"
                    type="text"
                    placeholder="From Location"
                    value={formik.values.fromLocation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.fromLocation && formik.errors.fromLocation && (
                    <div className="error-message">{formik.errors.fromLocation}</div>
                )}

                <p>Dropoff Location</p>
                <input
                    id="toLocation"
                    className="form-input"
                    name="toLocation"
                    type="text"
                    placeholder="To Location"
                    value={formik.values.toLocation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.toLocation && formik.errors.toLocation && (
                    <div className="error-message">{formik.errors.toLocation}</div>
                )}

                <p>Number of Passengers</p>
                <select
                    className="form-input"
                    name="passengerCount"
                    value={formik.values.passengerCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
                {formik.touched.passengerCount && formik.errors.passengerCount && (
                    <div className="error-message">{formik.errors.passengerCount}</div>
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

                <button type="submit" className="form-button">
                    Book Ride
                </button>
            </form>
        </div>
    );
};

export default RideForm;
