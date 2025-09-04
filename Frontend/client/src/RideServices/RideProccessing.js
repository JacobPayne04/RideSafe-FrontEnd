import axios from "axios";
import React, { useEffect,useState } from 'react';
import { toast } from "react-toastify";


const API_BASE_URL = "http://localhost:8080"; // Backend URL


export const acceptRide = async (rideId, driverId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/v1/rides/${rideId}/accept/${driverId}`);
        toast.success("✅ Ride accepted successfully!");
        return response.data; // Backend returns updated ride object
    } catch {
        console.error("Error accepting ride:");
        toast.error("❌ Failed to accept ride.");
    }
};


export const completeRide = async (rideId,driverId) => {
    try {
        const reponse = await axios.put(`${API_BASE_URL}/api/v1/rides${rideId}/complete`,null , {
            params: { driverId}
        });
        toast.success("🏁 Ride completed successfully!");
        console.log(reponse.data)
    } catch {
       
        toast.error("❌ Failed to complete ride.");
        console.log("Error completing ride:");
    }
};
export default { acceptRide, completeRide };