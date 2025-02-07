import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "900px",
};

const libraries = ["places"];

const ViewRideGoogleMaps = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Get lat/lng from URL params and parse as float
  const fromLat = parseFloat(params.get("fromLat"));
  const fromLng = parseFloat(params.get("fromLng"));
  const toLat = parseFloat(params.get("toLat"));
  const toLng = parseFloat(params.get("toLng"));

  const [directionsResponse, setDirectionsResponse] = useState(null);

  const fetchDirections = () => {
    if (!window.google || isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) {
      console.error("Invalid coordinates");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: fromLat, lng: fromLng },
        destination: { lat: toLat, lng: toLng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirectionsResponse(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={{ lat: fromLat || 37.7749, lng: fromLng || -122.4194 }} 
        zoom={12}
      >
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      {/* "Get Directions" Button */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button 
          onClick={fetchDirections} 
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Get Directions
        </button>
      </div>
    </LoadScript>
  );
};

export default ViewRideGoogleMaps;
