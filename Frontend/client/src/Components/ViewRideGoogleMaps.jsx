import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "90%",
  height: "700px",
  marginLeft: "5%"
};


const libraries = ["places"];

const ViewRideGoogleMaps = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const rideId = params.get("rideId");

  const fromLat = parseFloat(params.get("fromLat"));
  const fromLng = parseFloat(params.get("fromLng"));
  const toLat = parseFloat(params.get("toLat"));
  const toLng = parseFloat(params.get("toLng"));

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelInfo, setTravelInfo] = useState({ distance: "", duration: "" });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });


  

  useEffect(() => {
    if (isLoaded && fromLat && fromLng && toLat && toLng) {
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

            // Extract travel time and distance
            const route = result.routes[0].legs[0];
            setTravelInfo({
              distance: route.distance.text,
              duration: route.duration.text,
            });
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [isLoaded, fromLat, fromLng, toLat, toLng]);

  const endRide = async () => {
    try {
        const response = await axios.put(`http://localhost:8080/${rideId}/accept/complete`);
        console.log("Ride ended successfully!", response.data);
    } catch (error) {
        console.error("Failed to update ride:", error);
    }
};


  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => endRide()}>END RIDE</button>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {travelInfo.distance && travelInfo.duration && (
          <p>
            <strong>Estimated Ride:</strong> {travelInfo.distance} - {travelInfo.duration}
          </p>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: fromLat || 37.7749, lng: fromLng || -122.4194 }}
        zoom={15}
      >
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </div>
  );
};

export default ViewRideGoogleMaps;
