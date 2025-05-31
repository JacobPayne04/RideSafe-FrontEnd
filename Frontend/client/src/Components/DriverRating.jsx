import React, { useState } from 'react';
import axios from 'axios';

const DriverRating = ({ driverId, onClose }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const sendReview = async () => {
    if (selectedStars === 0) return;

    try {
      setSubmitting(true);
      await axios.put(`http://localhost:8080/send/Review`, {
        driverId: driverId,
        stars: selectedStars
      });
      onClose(); // Close popup or navigate
    } catch (err) {
      console.log('Failed to add review', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="mb-2">How was your ride? Add a review!</p>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedStars(num)}
            className={num <= selectedStars ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}
          >
            ★
          </button>
        ))}
      </div>
      <button
        onClick={sendReview}
        disabled={selectedStars === 0 || submitting}
        className="mt-3 bg-blue-500 text-white px-4 py-1 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default DriverRating