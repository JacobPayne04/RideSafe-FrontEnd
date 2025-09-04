import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styling/PassengerSettings.css";

const EditPassenger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    VenmoUserName: "",
    CashAppUserName: ""
  });

  const [error, setError] = useState("");
  //TODO### - fetch id from local storage and *
  //*
  //*
  //*
  //*
  // 



  // Fetch passenger details
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/passengers/${id}`)
      .then((res) => {
        setPassenger({
          ...res.data,
          password: "",
          confirmPassword: "",
        });
      })
      .catch(() => setError("Error fetching passenger data"));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (passenger.password && passenger.password !== passenger.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios
      .put(`http://localhost:8080/edit/passenger/${id}`, passenger)
      .then(() => {
        alert("Profile updated successfully!");
        navigate(`/passenger/profile/${id}`);
      })
      .catch(() => setError("Error updating profile information"));
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="edit-passenger-container">
      <button className="back-button" onClick={handleBack}>
        &larr; Back
      </button>
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
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-passenger-form">
        {/* Section 1: Personal Details */}
        <div className="form-section">
          <h3>Personal Details</h3>
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={passenger.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={passenger.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={passenger.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={passenger.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="input-group">
            <label>Cash App Username</label>
            <input
              type="text"
              name="CashAppUsername"
              value={passenger.CashAppUserName}
              onChange={handleChange}
              placeholder="Enter your cash app username"
            />
          </div>
          <div className="input-group">
            <label>Venmo Username</label>
            <input
              type="text"
              name="VenmoUserName"
              value={passenger.VenmoUserName}
              onChange={handleChange}
              placeholder="Enter your venmo username"
            />
          </div>
        </div>

        {/* Section 2: Password Update */}
        <div className="form-section">
          <h3>Update Password</h3>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={passenger.password}
              onChange={handleChange}
              placeholder="Enter new password (optional)"
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passenger.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPassenger;