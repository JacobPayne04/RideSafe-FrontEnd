import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styling/DriverRating.css'; // 👈 import the stylesheet

const DriverRating = ({ driverId, onClose }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const sendReview = async () => {
    if (selectedStars === 0) return;

    try {
      setSubmitting(true);
      await axios.put(`http://localhost:8080/api/v1/driver/send/Review`, {
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

      <div>
        <button
          style={{
            cursor: 'pointer',
            padding: '15px 30px',
            backgroundColor: '#ff6b00',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 107, 0, 0.3)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 0, 0.3)';
          }}
        >
          <Link to="/test" style={{ textDecoration: 'none', color: 'white' }}>TEST</Link>
        </button>
      </div>

    </div>
  );
};

export default DriverRating;
