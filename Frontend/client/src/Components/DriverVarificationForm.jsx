import React, { useState } from 'react';
import axios from 'axios';
import '../Styling/DriverVarificationForm.css'; // make sure this file is created

const DriverVerificationForm = () => {
  const [selfie, setSelfie] = useState(null);
  const [license, setLicense] = useState(null);
  const driverId = localStorage.getItem("driverId");

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('selfie', selfie);
    formData.append('license', license);

    try {
      await axios.post(`http://localhost:8080/driver/${driverId}/upload-docs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload documents.");
    }
  };

  return (
    <form onSubmit={handleUpload} className="verification-form-container">
      <h1 className="verification-title">Verify Your Identity</h1>
      <div className="upload-section">
        <label className="upload-label">Upload Selfie:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelfie(e.target.files[0])}
          className="upload-input"
        />
      </div>
      <div className="upload-section">
        <label className="upload-label">Upload Driver’s License:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLicense(e.target.files[0])}
          className="upload-input"
        />
      </div>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default DriverVerificationForm;
