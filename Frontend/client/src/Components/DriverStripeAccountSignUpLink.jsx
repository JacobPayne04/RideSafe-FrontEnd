import React from 'react'
import axios from 'axios'
import '../Styling/DriverStripeAccountSignUpLink.css'



const DriverStripeAccountSignUpLink = () => {

  const driverEmail = localStorage.getItem('driverEmail')
  const driverId = localStorage.getItem('driverId');

  const onboardStripe = async () => {
    try{
      const res = await fetch(`/api/stripe/onboard?email=${driverEmail}&driverId=${driverId}`, {
        method: "POST",
      });

      if(!res.ok){
        throw new Error('Stripe Onboarding request failed')
      }

      const url = await res.text();
      window.location.href = url; // send them to Stripe onboarding
    } catch (err) {
      console.log("stripe onboarding error: ", err)
      alert("failed to redirect to Stripe Onboarding")
    }
};

  return (
    <div className='Stripe-Onboarding-Page'>
      <h3 className='Stripe-Onboarding-Header'>Finish Onboarding With Stripe</h3>
      <button className='Stripe-Onboarding-btn' onClick={onboardStripe}>Finish Stripe Setup</button>
    </div>
    


)
}

export default DriverStripeAccountSignUpLink