import React from 'react';
import { Link } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
import './Header.css';
import { FaDatabase } from "react-icons/fa6";

const Header = () => {
    const location = useLocation();
    if (location.pathname === "/login" || location.pathname === "/signup") {
        return null;
    }
  return (
    <header>
      
      <div className="logo">
        <Link to="/">
        <FaDatabase size={30}/>
        </Link>
      </div>

      
      <nav className="nav-menu">
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/team">Team</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </nav>

      
      <div className="user-options">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </header>
  );
};

export default Header;
