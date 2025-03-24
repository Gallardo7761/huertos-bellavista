import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [heart, setHeart] = useState('💜');

  useEffect(() => {
    const hearts = ["❤️", "💛", "🧡", "💚", "💙", "💜"];
    const randomHeart = () => hearts[Math.floor(Math.random() * hearts.length)];
  
    const interval = setInterval(() => {
      setHeart(randomHeart());
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);
  
  return (
    <footer className="footer mt-auto row p-0 align-items-center bg-light">
      <div className="p-4 bg-green text-light">
        <h4 className="m-2 mb-4">Datos:</h4>
        <p className="m-2">
          <FontAwesomeIcon icon={faLocationDot} className="me-2" />
          Calle Cronos S/N, Bellavista, Sevilla, 41014
        </p>
        <p className="m-2">
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          huertoslasaludbellavista@gmail.com
        </p>
      </div>
      <h6 id="devd" className="p-3 m-0 text-center">
        Made with {heart} by{' '}
        <a href="https://gallardo.dev" target="_blank" rel="noopener noreferrer">
          Gallardo7761
        </a>
      </h6>
    </footer>
  );
};

export default Footer;
