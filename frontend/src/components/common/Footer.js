import React from 'react';
import { FaDatabase, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const location = useLocation();
    
    if (location.pathname === "/login" || location.pathname === "/signup") {
        return null;
    }

    return (
    <footer>
      <div className='logo'>
      <FaDatabase size={30} />
      </div>

      <div className="copyright">
        <p>&copy; 2024 MongoGen. All rights reserved.</p>
      </div>

      <div className="social-icons">
        <FaFacebook />
        <FaInstagram />
        <FaLinkedin />
      </div>
    </footer>
  );
};

export default Footer;