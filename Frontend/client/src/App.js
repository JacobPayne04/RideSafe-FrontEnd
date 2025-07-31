import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './Contexts/AuthContext';
import ProtectedRoute from './Security/ProtectedRoute';
import { useAuth } from './Contexts/AuthContext';
import AllDrivers from './Components/AllDrivers';
import DriverShow1 from './Components/DriverShow1';
import RegisterDriverLandingPage from './Components/RegisterDriverLandingPage';
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
import Test from './Components/Test';

// ✅ Load Stripe key correctly
const stripePromise = loadStripe(process.env.REACT_APP_PK_TEST_PUBLIC_KEY);

// ✅ Debug log
//console.log("✅ Stripe Key:", process.env.REACT_APP_PK_TEST_PUBLIC_KEY);
//console.log("✅ Google Client ID:", process.env.REACT_APP_CLIENTID);

function App() {
  const clientId = process.env.REACT_APP_CLIENTID || "";

  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
          <Routes>
            {/* Base Routes */}
            <Route path="/" element={<RegisterDriverLandingPage />} />

            {/* Admin Routes */}
            {/* SECURE ADMIN ROUTES */}
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/drivers/all" element={<AllDrivers />} />
            <Route path="/passengers/all" element={<AllPassengers />} />

            {/* Driver Routes */}
      
            {/* SECURE DRIVER ROUTES */}
            <Route path="/register/driver/google" element={<GoogleRegisterDriver />} />
            <Route path="/driver/home/:id" element={<DriverHomePage />} />
            <Route path="/edit/driver/:id/info" element={<ProtectedRoute roles={['driver']}><EditDriver /></ProtectedRoute>} />
            <Route path="/driver/:id/verification/account/setup" element={<DriverStripeAccountSignUpLink />} />
            <Route path="/driver/:id/rating/page" element={<DriverRating />} />
            <Route path="/one/driver/:id" element={<ProtectedRoute roles={['driver']}> <DriverShow1 /> </ProtectedRoute>} />

            {/* Passenger Routes */}

            <Route path="/register/passenger/google" element={<GoogleRegisterPassenger />} />
           
            {/* SECURE PASSENGER ROUTES */}
            <Route path="/Passenger/show1/Booking" element={<PassengerShow1 />} />
            <Route path="/Passenger/home" element={<PassengerHomePage />} />
            <Route path="/Passenger/home/settings" element={<PassengerSettings />} />



            {/* Ride Routes */}
            {/* SECURE RIDE ROUTES */}
            <Route path="/passenger/:passengerId/book/ride/driver/:driverId" element={<RideForm />} />
            <Route path="/view/ride/googlemaps" element={<ViewRideGoogleMaps />} />
          
            {/* Google API Routes */}
            <Route path="/google/signin/:role" element={<GoogleSignIn />} />

            {/* Payment Routes */}
            {/* SECURE PAYMENT ROUTES */}
            <Route
              path="/ride/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              }
            />

            {/* Test Routes */}
            {/* SECURE TEST ROUTE AND MOVE TO ADMIN PANEL */}
            <Route path="/test" element={<Test />} />

          </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
