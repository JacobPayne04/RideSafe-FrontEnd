import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Backend URL

export const acceptRide = async (rideId, driverId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${rideId}/accept/${driverId}`);
        return response.data; // Backend returns updated ride object
    } catch (error) {
        console.error("Error accepting ride:", error);
        throw error;
    }
};
