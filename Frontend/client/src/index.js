import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// ✅ Load your Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// 🔍 Optional debug log
console.log("✅ Stripe Key:", process.env.REACT_APP_STRIPE_PUBLIC_KEY);
console.log("✅ Google Client ID:", process.env.REACT_APP_CLIENTID);

// ✅ Mount the app with Stripe Elements wrapped around it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENTID}>
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Elements>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
