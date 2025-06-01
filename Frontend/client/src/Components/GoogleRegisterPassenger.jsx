import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';


const GoogleRegisterPassenger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const GoogleEmail = userData.email || '';
  const GoogleID = userData.googleId || '';

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: GoogleEmail,
      googleId: GoogleID
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required')
    }),

    onSubmit: async (values) => {
      try {
        console.log("Submitting data:", values);
        const response = await axios.post("http://localhost:8080/new/passenger", values, {

          headers: { 'Content-Type': 'application/json' }
        });
        console.log("Passenger created:", response.data);
        const passengerId = response.data.id; // or response.data.passengerId depending on your backend
        localStorage.setItem("passengerId", passengerId);
        navigate("/Passenger/home");
      } catch (error) {
        console.error('There was an error!', error.response ? error.response.data : error);
      }

    },
  });

  //#TODO add prefilled fields.
  return (
    <div>
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


        <button type="submit">Complete Sign-Up</button>
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

  );
};

export default GoogleRegisterPassenger