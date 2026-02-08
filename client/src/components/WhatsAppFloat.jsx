// WhatsAppFloat.jsx
import React from 'react';
import './WhatsAppFloat.css';

function WhatsAppFloat() {
  const phoneNumber = '918618659319'; // WhatsApp number (without + or spaces)
  const message = 'Hello! I would like to know more about MytechZ services.';
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-float" onClick={handleClick} aria-label="Chat on WhatsApp">
      <i className="ri-whatsapp-line"></i>
    </div>
  );
}

export default WhatsAppFloat;
