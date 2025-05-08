import React, { useState } from 'react';

const DriverSignUpForm = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [dlFile, setDlFile] = useState(null);
  const [studentIdFile, setStudentIdFile] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [eSign, setESign] = useState('');

//TODO## make dto for backend 
//TODO## imipliment the logic for front end sending




  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      alert("You must accept the terms of service.");
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('licensePlate', licensePlate);
    formData.append('dlFile', dlFile);
    formData.append('studentIdFile', studentIdFile);
    formData.append('acceptedTerms', acceptedTerms);
    formData.append('eSign', eSign);

    onSubmit(formData); // or post to your backend
  };

  return (
    <form onSubmit={handleSubmit} className="driver-signup-form">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />

      <div>
        <label>Upload DL:</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setDlFile(e.target.files[0])}
          required
        />
      </div>

      <div>
        <label>Upload Student ID:</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setStudentIdFile(e.target.files[0])}
          required
        />
      </div>

      <input
        type="text"
        placeholder="Confirm License Plate"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        required
      />

      <div>
        <label>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          Accept Terms of Service
        </label>
      </div>

      <input
        type="text"
        placeholder="E-Sign"
        value={eSign}
        onChange={(e) => setESign(e.target.value)}
        required
      />

      <button type="submit">Done</button>
    </form>
  );
};

export default DriverSignUpForm;
