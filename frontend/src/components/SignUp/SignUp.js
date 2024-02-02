import React from 'react';
import './SignUp.css';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignUp = () => {
  const { register, handleSubmit, errors } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      navigate('/login')
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
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
          Email:
          <input
            type="email"
            name="email"
            {...register('Email is required', { required: true })}
            className="input"
          />
          {errors && errors.email && (<span className="error-message">{errors.email.message}</span>)}
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
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
