import React, { useState } from 'react';
import '../Styling/RegisterDriver.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterDriver = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        licensePlate: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/new', formData)
            .then((response) => {
                console.log('Response from server:', response.data);
                const driverId = response.data.id;
                navigate(`/one/driver/${driverId}`);
            })
            .catch((error) => {
                console.log('There was an error!', error);
            });
    };

    return (
        <div className="register-driver-container">
            <form onSubmit={handleSubmit} className="register-driver-form">
                <h2>Register Driver</h2>
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
                <div className="form-group">
                    <label>License Plate</label>
                    <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} />
                </div>
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default RegisterDriver;
