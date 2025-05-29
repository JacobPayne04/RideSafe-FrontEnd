import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styling/DriverStripeAccountSignUpLink.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const DriverStripeAccountSignUpLink = () => {
  const { id: driverId} = useParams();
  const driverEmail = localStorage.getItem('driverEmail');
  const location = useLocation();
  const navigate = useNavigate();

  const [selfie, setSelfie] = useState(null);
  const [license, setLicense] = useState(null);
  const [docsUploaded, setDocsUploaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if(params.get('stripe') === 'success'){
      navigate(`/one/driver/${driverId}`);
    }
  }, [location.search, driverId, navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('selfie', selfie);
    formData.append('license', license);

    try {
      await axios.post(`http://localhost:8080/driver/${driverId}/upload-docs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocsUploaded(true);
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload documents.');
    }
  };

  const onboardStripe = async () => {
    try {
      const res = await fetch(`http://localhost:8080/Driver/stripe/signup?email=${driverEmail}&driverId=${driverId}`, {
        method: 'POST',
      });


      if (!res.ok) {
        throw new Error('Stripe Onboarding request failed');
      }

      const url = await res.text();
      window.location.href = url;
    } catch (err) {
      console.log('stripe onboarding error: ', err);
      alert('Failed to redirect to Stripe Onboarding');
    }
  };

  return (
    <div className="Stripe-Onboarding-Page">
      <h1 className="Stripe-Onboarding-Header">Verify Your Identity</h1>
      <form onSubmit={handleUpload} className="Verification-Form">
        <div className="Upload-Group">
          <label className="Upload-Label">Upload Selfie:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelfie(e.target.files[0])}
            className="Upload-Input"
          />
        </div>
        <div className="Upload-Group">
          <label className="Upload-Label">Upload Driver’s License:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLicense(e.target.files[0])}
            className="Upload-Input"
          />
        </div>
        <button type="submit" className="Stripe-Onboarding-btn">Submit Documents</button>
      </form>

      <h3 className="Stripe-Onboarding-Header">Driver Stripe Account Setup</h3>
      <button onClick={onboardStripe} className="Stripe-Onboarding-btn">
        Finish Stripe Setup
      </button>
    </div>
  );
};

export default DriverStripeAccountSignUpLink;
