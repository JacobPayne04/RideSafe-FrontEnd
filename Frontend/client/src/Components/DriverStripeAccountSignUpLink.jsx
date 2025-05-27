import React from 'react'
import axios from 'axios'
import { useState } from 'react';


const DriverStripeAccountSignUpLink = () => {
  const onboardStripe = async () => {
    try {
      const email = localStorage.getItem("userEmail");

      if (!email) {
        alert("Email not found in localStorage. Please log in again.");
        return;
      }

      const res = await fetch("http://localhost:8080/Driver/stripe/signup?email=" + email, {
        method: "POST",
        
      });
       console.log("Using email:", email)
      if (!res.ok) {
       
        throw new Error("Failed to get Stripe onboarding link.");
       
      }

      const url = await res.text();
      window.location.href = url;
    } catch (error) {
      
      console.error("Stripe onboarding failed:", error);
      alert("Stripe setup failed. Check console for details.");
    }
  };

  return (
    <div>
      <h3>Driver Stripe Account Setup</h3>
      <button onClick={onboardStripe}>Finish Stripe Setup</button>
    </div>
  );
};

export default DriverStripeAccountSignUpLink

