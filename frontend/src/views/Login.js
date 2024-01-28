// src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        const loginData = { email, password };
        const response = await axios.post('http://127.0.0.1:8000/users/login', loginData);
        console.log(response.data);  // Handle the response accordingly

        console.log('Logged in successfully')
    } catch (error) {
        console.error('Error during login:', error);
    }
    
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label className="label">
          Email:
          <input type="text" value={email} onChange={(e) => setemail(e.target.value)} className="input" />
        </label>
        <label className="label">
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        </label>
        <button type="submit" className="button">
          Login
        </button>
      </form>
      <p>
        Create a new account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
