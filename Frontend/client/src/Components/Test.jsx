import React from 'react'
import { useState } from 'react'
import '../Styling/Test.css'




const Test = () => {
  const [formData, setFormData] = useState({//form object "information we are recieving from the user"
    firstName: '',
    lastName: '',
    Email: '',
    password: '',
    passwordconfirm: '',
    licensePlate: ''
  });


  const handleChange = (e) => {//from e target destricture the name and value then set all of the form dta to its value from its name
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {//nothing to backend yet simply showing the data in console
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  //temp handle submit TODO make the axios call via backend
  const HandleSubmite = (e) => {
    e.preventDefault();
    axios.post('http://loclahost:8080/api/drivers',formData)
    //axios call
    .then((response)=>{
      console.log('Response from server:', response.data)
      //handle scucess
    })
    .catch((error)=>{
      console.log('There was a error!',error);
      //handle error
    });
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
          name="confrimPassword"
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