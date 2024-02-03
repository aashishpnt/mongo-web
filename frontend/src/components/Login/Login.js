import React from 'react';
import './Login.css';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { register, handleSubmit, getValues, errors } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      console.log('Logged in successfully');
      const password = getValues("password")
      const username = getValues("username");
      console.log('Username:', username);
      console.log('Password:', password);
      navigate('/dashboard');
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
            {...register('username', { required: true })}
            className="input"
          />
          {errors && errors.username && (<span className="error-message">{errors.username.message}</span>)}
        </label>
        <label className="label">
          Password:
          <input
            type="password"
            name="password"
            {...register('password', { required: true })}
            className="input"
          />
          {errors && errors.password && (<span className="error-message">{errors.password.message}</span>)}
        </label>
        <button type="submit" className="button">
          Login
        </button>
      </form>
      <p>
        Create a new account? <Link to="/signup">SignUp</Link>
      </p>
    </div>
  );
};

export default Login;
