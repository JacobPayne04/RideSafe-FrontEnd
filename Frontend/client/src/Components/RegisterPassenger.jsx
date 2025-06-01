import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import '../Styling/RegisterPassenger.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPassenger = () => {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },

        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/[A-z]/, 'Password must contain a letter')
                .matches(/[0-9]/, 'Password must contain a number')
                .matches(/[!@#$%^&*]/, 'Password must contain a special character')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
        }),

        onSubmit: (values) => {
            axios
                .post('http://localhost:8080/new/passenger', values)
                .then((response) => {
                    const passengerId = response.data.id;
                    localStorage.setItem('passengerId', passengerId);
                    navigate(`/Passenger/home`);
                })
                .catch((error) => {
                    console.error('There was an error!', error);
                });
        },
    });

    const handleLogin = () => {
        navigate('/login/passenger');
    };
    return (
        <div className="form-container">
            <form onSubmit={formik.handleSubmit} className="form-content">
                <h2 className="form-title">Register Passenger</h2>
                <input
                    className="form-input"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                    <div className="error-message">{formik.errors.firstName}</div>
                )}

                <input
                    className="form-input"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                    <div className="error-message">{formik.errors.lastName}</div>
                )}

                <input
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="error-message">{formik.errors.email}</div>
                )}

                <input
                    className="form-input"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="error-message">{formik.errors.password}</div>
                )}

                <input
                    className="form-input"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="error-message">{formik.errors.confirmPassword}</div>
                )}

                <button type="submit" className="form-button">
                    Register
                </button>
                <button
                    type="button"
                    onClick={handleLogin}
                    className="form-button secondary-button"
                >
                    Already have an account? Login!
                </button>
            </form>

            <div>
                <button
                    style={{
                        cursor: 'pointer',
                        padding: '15px 30px',
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(0.98)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.3)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
                    }}
                >
                    <Link to="/test" style={{ textDecoration: 'none', color: 'white' }}>TEST</Link>
                </button>
            </div>

        </div>
    )
}

export default RegisterPassenger