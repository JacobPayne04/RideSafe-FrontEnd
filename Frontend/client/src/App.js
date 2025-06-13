import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GoogleOAuthProvider } from '@react-oauth/google';

import AllDrivers from './Components/AllDrivers';
import DriverShow1 from './Components/DriverShow1';
import LoginDriver from './Components/LoginDriver';
import RegisterDriverLandingPage from './Components/RegisterDriverLandingPage';
import RegisterDriver from './Components/RegisterDriver';
import RegisterPassenger from './Components/RegisterPassenger';
import LoginPassenger from './Components/LoginPassenger';
import RideForm from './Components/RideForm';
import PassengerShow1 from './Components/PassengerShow1';
import DriverHomePage from './Components/DriverHomePage';
import ViewRideGoogleMaps from './Components/ViewRideGoogleMaps';
import GoogleRegisterPassenger from './Components/GoogleRegisterPassenger';
import GoogleRegisterDriver from './Components/GoogleRegisterDriver';
import GoogleSignIn from './Components/GoogleSignIn';
import AdminHome from './Components/AdminHome';
import CheckoutForm from './Components/CheckoutForm';
import EditDriver from './Components/EditDriver';
import PassengerHomePage from './Components/PassengerHomePage';
import PassengerSettings from './Components/PassengerSettings';
import DriverStripeAccountSignUpLink from './Components/DriverStripeAccountSignUpLink';
import DriverRating from './Components/DriverRating';
import AllPassengers from './Components/AllPassengers';
import PassengerRideWaitingScreen from './Components/PassengerRideWaitingScreen';
import Test from './Components/Test';

// ✅ Load Stripe key correctly
const stripePromise = loadStripe(process.env.REACT_APP_PK_TEST_PUBLIC_KEY);

// ✅ Debug log
//console.log("✅ Stripe Key:", process.env.REACT_APP_PK_TEST_PUBLIC_KEY);
//console.log("✅ Google Client ID:", process.env.REACT_APP_CLIENTID);

function App() {
  const clientId = process.env.REACT_APP_CLIENTID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        {/* Base Routes */}
        <Route path="*" element={<AllDrivers />} />
        <Route path="/" element={<RegisterDriverLandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={<AdminHome />} />

        {/* Driver Routes */}
        <Route path="/drivers/all" element={<AllDrivers />} />
        <Route path="/one/driver/:id" element={<DriverShow1 />} />
        <Route path="/login/driver" element={<LoginDriver />} />
        <Route path="/register/driver" element={<RegisterDriver />} />
        <Route path="/register/driver/google" element={<GoogleRegisterDriver />} />
        <Route path="/driver/home/:id" element={<DriverHomePage />} />
        <Route path="/edit/driver/:id/info" element={<EditDriver />} />
        <Route path="/driver/:id/verification/account/setup" element={<DriverStripeAccountSignUpLink />} />
        <Route path="/driver/:id/rating/page" element={<DriverRating/>} />

        {/* Passenger Routes */}
        <Route path="/passengers/all" element={<AllPassengers />} />
        <Route path="/register/passenger" element={<RegisterPassenger />} />
        <Route path="/register/passenger/google" element={<GoogleRegisterPassenger />} />
        <Route path="/login/passenger" element={<LoginPassenger />} />
        <Route path="/Passenger/show1/Booking" element={<PassengerShow1 />} />
        <Route path="/Passenger/home" element={<PassengerHomePage />} />
        <Route path="/Passenger/home/settings" element={<PassengerSettings />} />
    
        

        {/* Ride Routes */}
        <Route path="/passenger/:passengerId/book/ride/driver/:driverId" element={<RideForm />} />
        <Route path="/view/ride/googlemaps" element={<ViewRideGoogleMaps />} />
        <Route path="/passenger/ride/waiting" element={ <PassengerRideWaitingScreen /> } />

        {/* Google API Routes */}
        <Route path="/google/signin/:role" element={<GoogleSignIn />} />

        {/* Payment Routes */}
        <Route
          path="/ride/checkout"
          element={
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          }
        />

        {/* Test Routes */}
        <Route path="/test" element={ <Test /> } />

      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
