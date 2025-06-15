import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from './Contexts/AuthContext'; // ⬅️ Import this!

const stripePromise = loadStripe(process.env.REACT_APP_PK_TEST_PUBLIC_KEY);

console.log("✅ Stripe Key:", process.env.REACT_APP_PK_TEST_PUBLIC_KEY);
console.log("✅ Google Client ID:", process.env.REACT_APP_CLIENTID);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENTID}>
      <Elements stripe={stripePromise}>
        <AuthProvider> {/* ✅ Wrap everything in this */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </Elements>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
