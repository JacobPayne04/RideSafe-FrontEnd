import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
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
        const passengerId = localStorage.getItem("passengerId");
        navigate("/Passenger/home");
      } catch (error) {
        console.error('There was an error!', error.response ? error.response.data : error);
      }

    },
  });

  //#TODO add prefilled fields.
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


      <button type="submit">Complete Sign-Up</button>
    </form>
  );
};

export default GoogleRegisterPassenger