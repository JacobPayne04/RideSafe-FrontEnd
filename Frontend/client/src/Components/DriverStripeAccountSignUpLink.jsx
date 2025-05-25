import React from 'react'
import axios from 'axios'



const DriverStripeAccountSignUpLink = () => {

    const onboardStripe = async () => {
  const res = await fetch("/api/stripe/onboard?email=" + userEmail, {
    method: "POST",
  });
  const url = await res.text();
  window.location.href = url; // send them to Stripe onboarding
};

  return (
    <div>DriverStripeAccountSignUpLink
            <button onClick={onboardStripe}>Finish Stripe Setup</button>

    </div>
    


)
}

export default DriverStripeAccountSignUpLink