import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import axios from "axios";
import "../Styling/EditDriver.css"; // Import external stylesheet
import { useAuth } from '../Contexts/AuthContext';
import axiosSecure from "../Security/axiosSecure";

const EditDriver = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

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
      .get(`http://localhost:8080/api/v1/driver/${id}`, { withCredentials: true })
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

  if (user?.userId !== id) {
    return <Navigate to="/" replace />;
  }
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (driver.password && driver.password !== driver.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios.put(
      `http://localhost:8080/api/v1/drivers/edit/${id}`,
      driver,
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    )
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

export default EditDriver;
