import React, { useState } from 'react';
import axios from 'axios';
import '../Styling/DriverRating.css'; // 👈 import the stylesheet

const DriverRating = ({ driverId, onClose }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const sendReview = async () => {
    if (selectedStars === 0) return;

    try {
      setSubmitting(true);
      await axios.put(`http://localhost:8080/send/Review`, {
        driverId: driverId,
        stars: selectedStars,
      });
      onClose();
    } catch (err) {
      console.log('Failed to add review', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rating-container">
      <p className="rating-prompt">How was your ride? Add a review!</p>
      <div className="stars-wrapper">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedStars(num)}
            className={`star-button ${num <= selectedStars ? 'selected' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      <button
        onClick={sendReview}
        disabled={selectedStars === 0 || submitting}
        className="submit-button"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default DriverRating;
