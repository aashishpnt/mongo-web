import React, {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom'; 
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaDatabase } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { fetchToken } from '../Auth';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const auth = fetchToken();

    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername){
        setUsername(storedUsername);
      }
    }
    );

    const signout = () => {
      localStorage.removeItem('loginToken')
      navigate("/")
    };
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
          <li><NavLink to="/">Home</NavLink></li>
          {auth && (
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            )}
          <li><NavLink to="/team">Team</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
        </ul>
      </nav>

      
      <div className="user-options">
      {auth ? (
          <>
            <span><FaUser />  {username} &nbsp;&nbsp;</span>
            <button onClick={signout} className='button-filled'>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
