import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styling/EditDriver.css"; // Import external stylesheet

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState({
    firstName: "",
    lastName: "",
    email: "",
    licensePlate: "",
    driverRate: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // Fetch driver details
  useEffect(() => {
    axios
      .get(`http://localhost:8080/driver/${id}`)
      .then((res) => {
        setDriver({
          ...res.data,
          password: "",
          confirmPassword: "",
        });
      })
      .catch(() => setError("Error fetching driver data"));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (driver.password && driver.password !== driver.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios
      .put(`http://localhost:8080/edit/driver/${id}`, driver)
      .then(() => {
        alert("Driver information updated successfully!");
        navigate(`/one/driver/${id}`);
      })
      .catch(() => setError("Error updating driver info"));
  };

  return (
    <div className="edit-driver-container">
      <h2>Edit Driver Information</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-driver-form">
        
        {/* Section 1: Personal Details */}
        <div className="form-section">
          <h3>Personal Details</h3>
          <div className="input-group">
            <label>First Name:</label>
            <input type="text" name="firstName" value={driver.firstName} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Last Name:</label>
            <input type="text" name="lastName" value={driver.lastName} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input type="email" name="email" value={driver.email} onChange={handleChange} />
          </div>
        </div>

        {/* Section 2: Vehicle Information */}
        <div className="form-section">
          <h3>Vehicle Information</h3>
          <div className="input-group">
            <label>License Plate:</label>
            <input type="text" name="licensePlate" value={driver.licensePlate} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Driver Rate ($):</label>
            <input type="number" name="driverRate" value={driver.driverRate} onChange={handleChange} />
          </div>
        </div>

        {/* Section 3: Password Update */}
        <div className="form-section">
          <h3>Update Password</h3>
          <div className="input-group">
            <label>New Password:</label>
            <input type="password" name="password" value={driver.password} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={driver.confirmPassword} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="submit-button">Update Driver</button>
      </form>
    </div>
  );
};

export default EditDriver;
