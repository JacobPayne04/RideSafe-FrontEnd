import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
          const driverId = res.data.id;
          localStorage.setItem('driverId', driverId);
          const driverEmail = res.data.email;
          localStorage.setItem('driverEmail', driverEmail);
          navigate(`/driver/home/${driverId}`);
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

      <h1 className="login-heading">Driver Login</h1>
      
      <form onSubmit={formik.handleSubmit} className="login-form">
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`login-input ${
              formik.touched.email && !formik.errors.email ? 'valid' : ''
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`login-input ${
              formik.touched.password && !formik.errors.password ? 'valid' : ''
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}
        </div>

        {formik.errors.general && (
          <div className="error-message">{formik.errors.general}</div>
        )}

        <button 
          type="submit" 
          className={`login-button ${formik.isSubmitting ? 'loading' : ''}`}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        {/* Optional: Add forgot password link */}
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        {/* Optional: Add sign up prompt */}
        <div className="signup-prompt">
          Don't have an account?
          <Link to="/register/driver">Sign up as a driver</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginDriver;