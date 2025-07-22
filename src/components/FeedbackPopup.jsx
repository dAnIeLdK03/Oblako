import React from "react";

function FeedbackPopup({ onClose }) {
  return (
    <div className="feedback-popup-modal">
      <div className="feedback-popup-content">
        <button className="feedback-popup-close" onClick={onClose}>×</button>
        <h3>Анкета за обратна връзка</h3>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSd4Fy2P3kzm9YGwgL_o7ubcu2tC-AMJZ2hrUYCWCJlrD8hVpA/viewform?usp=header"
          width="100%"
          height="500"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Feedback Form"
          style={{border: 'none', borderRadius: 12, marginTop: 12}}
        >
          Зарежда се...
        </iframe>
      </div>
    </div>
  );
}

export default FeedbackPopup; 