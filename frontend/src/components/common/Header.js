import React from 'react';
import { NavLink } from 'react-router-dom'; 
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
        <NavLink to="/">
        <FaDatabase size={30}/>
        </NavLink>
      </div>

      
      <nav className="nav-menu">
        <ul>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/#features" smooth>Features</NavLink></li>
          <li><NavLink to="/team">Team</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
        </ul>
      </nav>

      
      <div className="user-options">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Signup</NavLink>
      </div>
    </header>
  );
};

export default Header;
