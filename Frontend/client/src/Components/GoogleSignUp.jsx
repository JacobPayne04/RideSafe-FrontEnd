import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const GoogleSignUp = () => {

    const navigate = useNavigate()
    const { role } = useParams
    const location = useLocation()
    const { email, googleId } = location.state || {}

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required')
        }),
        onSubmit: (values) => {
            const data = { ...values, email, googleId };

            axios.put(`/http:localhost:8080/register/${role}/google`, data)
                .then(() => {
                    console.log("Google Sign Up Successful: ", data)
                })
                .catch((error) => console.error('There was an error: ', error))
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <h2>Complete Google Sign-Up for {role}</h2>
                <p>Email: <strong>{email}</strong></p>

                <input
                    name="firstName"
                    placeholder="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && <div>{formik.errors.firstName}</div>}

                <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && <div>{formik.errors.lastName}</div>}

                <button type="submit">Complete Sign-Up</button>
            </form>
        </div>
    )
}

export default GoogleSignUp