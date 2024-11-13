import React from 'react'
import { useState } from 'react'
import '../Styling/Test.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'





const Test = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({//form object "information we are recieving from the user"
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licensePlate: ''
  });


  const handleChange = (e) => {//from e target destricture the name and value then set all of the form dta to its value from its name
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
//
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/new',formData)
    //axios call
    .then((response)=>{
      console.log('Response from server:', response.data)
      //handle scucess
      const driverId = response.data.id;

      navigate(`/one/driver/${driverId}`)

    })
    .catch((error)=>{
      console.log('There was a error!',error);
      //handle error
    });
  };

  //temp handle submit TODO make the axios call via backend



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
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label className="label">Driver Password:</label>
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label className="label">Driver Confirm Password:</label>
        <input
          type="text"
          name="confirmPassword"
          value={formData.confirmPassword}
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