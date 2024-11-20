import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../Styling/LoginDriver.css';

const LoginDriver = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-z]/, 'Password must contain a letter')
        .matches(/[0-9]/, 'Password must contain a number')
        .matches(/[!@#$%^&*]/, 'Password must contain a special character')
        .required('Password is required'),
    }),

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await axios.post('http://localhost:8080/login', values, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.data.message === 'Login successful') {
          navigate('/driver/all');
        } else {
          setFieldError('general', res.data.message || 'Login failed. Please try again.');
        }
      } catch (err) {
        console.error('❌ Error during login:', err);
        setFieldError(
          'general',
          err.response?.data?.message || 'An unexpected error occurred.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <h1 className="login-heading">Login Driver</h1>
      <form onSubmit={formik.handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="login-input"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="login-input"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="error-message">{formik.errors.password}</div>
        )}

        {formik.errors.general && (
          <p className="error-message">{formik.errors.general}</p>
        )}

        <button type="submit" className="login-button" disabled={formik.isSubmitting}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginDriver;
