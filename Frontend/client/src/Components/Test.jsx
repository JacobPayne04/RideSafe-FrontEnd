import React from 'react'
import { useState } from 'react'
import '../Styling/Test.css'


const Test = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      licensePlate: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form Data:', formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Driver First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Driver Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Driver Email:</label>
          <input
            type="text"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Driver Password:</label>
          <input
            type="text"
            name="lastName"
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Driver Confirm Password:</label>
          <input
            type="text"
            name="lastName"
            value={formData.passwordconfirm}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">License Plate:</label>
          <input
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <button type="submit" className="button">Submit</button>
      </form>
    );
}
export default Test