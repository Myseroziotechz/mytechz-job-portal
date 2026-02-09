import React from 'react';
import './WhatsAppFloat.css';

function WhatsAppFloat() {
  const phoneNumber = '918618659319'; // WhatsApp format: country code + number (no + or spaces)
  const message = 'Hello! I would like to know more about MytechZ services.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <i className="ri-whatsapp-line"></i>
    </a>
  );
}

export default WhatsAppFloat;
