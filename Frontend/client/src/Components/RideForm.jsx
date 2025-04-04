import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../Styling/RideForm.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const RideForm = () => {
  const { passengerId, driverId } = useParams();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const formik = useFormik({
    initialValues: {
      passengerId: passengerId || "",
      driverId: driverId || "",
      fromLocation: "",
      toLocation: "",
      fromLatitude: "",
      fromLongitude: "",
      toLatitude: "",
      toLongitude: "",
      status: "PENDING",
      isPaid: false,
      passengerAmount: "1",
      rate: 10,
    },
    validationSchema: Yup.object({
      passengerId: Yup.string().required("Passenger ID is required"),
      driverId: Yup.string().required("Driver ID is required"),
      fromLocation: Yup.string().required("Pickup location is required"),
      toLocation: Yup.string().required("Dropoff location is required"),
      passengerAmount: Yup.number()
        .required("Passenger count is required")
        .min(1, "Must be at least 1")
        .max(5, "Cannot exceed 5 passengers"),
    }),
    onSubmit: async (values) => {
      try {
        const driverResponse = await axios.get(`http://localhost:8080/driver/${values.driverId}`);
        const driversRate = driverResponse.data.driverRate;

        if (!driversRate) {
          throw new Error("Driver's rate is not available");
        }

        const calculatedRate = driversRate * values.passengerAmount;
        const rideData = { ...values, rate: calculatedRate };

        const response = await axios.post("http://localhost:8080/rides/save", rideData);

        if (response.data && response.data.rideId) {
          localStorage.setItem("rideId", response.data.rideId);
          localStorage.setItem("passengerAmount", values.passengerAmount);
          navigate(`/ride/checkout`);
        } else {
          console.error("Error: Ride ID is undefined in response data", response.data);
        }
      } catch (error) {
        console.error("Error fetching driver rate or saving ride:", error);
      }
    },
  });

  useEffect(() => {
    if (isLoaded && window.google?.maps?.places) {
      const options = { types: ["geocode"] };

      const setupAutocomplete = (id, latField, lngField) => {
        const input = document.getElementById(id);
        if (input) {
          const autocomplete = new window.google.maps.places.Autocomplete(input, options);
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              formik.setFieldValue(latField, place.geometry.location.lat());
              formik.setFieldValue(lngField, place.geometry.location.lng());
              formik.setFieldValue(id, place.formatted_address);
            }
          });
        }
      };

      setupAutocomplete("fromLocation", "fromLatitude", "fromLongitude");
      setupAutocomplete("toLocation", "toLatitude", "toLongitude");
    }
  }, [isLoaded]);

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit} className="form-content">
        <h2 className="form-title">Where are we going today?</h2>

        <input name="passengerId" type="hidden" value={formik.values.passengerId} />
        <input name="driverId" type="hidden" value={formik.values.driverId} />
        <input name="status" type="hidden" value={formik.values.status} />

        <label>Pickup Location</label>
        <input
          id="fromLocation"
          className="form-input"
          name="fromLocation"
          type="text"
          placeholder="Enter pickup location"
          value={formik.values.fromLocation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.fromLocation && formik.errors.fromLocation && (
          <div className="error-message">{formik.errors.fromLocation}</div>
        )}

        <label>Dropoff Location</label>
        <input
          id="toLocation"
          className="form-input"
          name="toLocation"
          type="text"
          placeholder="Enter dropoff location"
          value={formik.values.toLocation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.toLocation && formik.errors.toLocation && (
          <div className="error-message">{formik.errors.toLocation}</div>
        )}

        <label>Number of Passengers</label>
        <select
          className="form-input"
          name="passengerAmount"
          value={formik.values.passengerAmount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        {formik.touched.passengerAmount && formik.errors.passengerAmount && (
          <div className="error-message">{formik.errors.passengerAmount}</div>
        )}

        <button type="submit" className="form-button">
          Book Ride
        </button>
      </form>
    </div>
  );
};

export default RideForm;
