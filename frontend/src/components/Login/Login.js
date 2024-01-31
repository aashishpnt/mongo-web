import React from 'react';
import './Login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/login', data);
      console.log(response.data); // Handle the response accordingly
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="label">
          Username:
          <input
            type="text"
            name="username"
            {...register('Query is required', { required: true })}
            className="input"
          />
          {errors && errors.username && (<span className="error-message">{errors.username.message}</span>)}
        </label>
        <label className="label">
          Password:
          <input
            type="password"
            name="password"
            {...register('Password is required', { required: true })}
            className="input"
          />
          {errors && errors.password && (<span className="error-message">{errors.password.message}</span>)}
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
