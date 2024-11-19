import React, { useState } from 'react';
import '../Styling/RegisterPassenger.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPassenger = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = () => {
        navigate('/login/passenger');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/new/passenger', formData)
            .then((response) => {
                console.log('Response from server:', response.data);
                const passengerId = response.data.id;
                navigate(`/one/passenger/${passengerId}`);
            })
            .catch((error) => {
                console.log('There was an error!', error);
            });
    };
  return (
    <div className='register-passenger-container'>
        <form onSubmit={handleSubmit} className="register-passenger-form">
                <h2>Register Passenger</h2>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                </div>
                <button type="submit" className="submit-button">Register</button>
                <button onClick={handleLogin} className='submit-button'>Already have an account?
                    Login here!
                </button>
            </form>
    </div>
  )
}

export default RegisterPassenger