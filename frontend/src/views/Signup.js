// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSignup = async () => {
    try {
        const userData = { username, email, password };
        const response = await axios.post('http://127.0.0.1:8000/users/register', userData);
        console.log(response.data);
        console.log('User signed up successfully');
        setShowPopup(true);
    } catch (error) {
        console.error('Error during signup:', error);
    }
};

  return (
    <div className='container'>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <label className='label'>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" />
        </label>
        <label className='label'>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </label>
        <label className='label'>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        </label>
        <button type="submit" className='button'>Signup</button>
      </form>  
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {showPopup && (
                <div className="popup">
                    <p>User has been successfully registered!</p>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}
    </div>
    
  );
};

export default Signup;
