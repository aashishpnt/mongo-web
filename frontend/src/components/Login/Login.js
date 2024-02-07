import React from 'react';
import './Login.css';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { setToken, fetchToken } from "../Auth";

const Login = () => {
  const { register, handleSubmit, getValues, errors } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const username = getValues("username");
      const password = getValues("password");

      // console.log('Username:', username);
      // console.log('Password:', password);
      if(username.length === 0){
        alert("Username has left Blank!");
      }
      else if(password.length === 0){
        alert("password has left blank!");
      }
      else{
        // console.log('Logged in suceessfully')
        axios.post('http://localhost:8000/users/login', {
          username: username,
          password: password
        })
        .then(function (response) {
          console.log(response);
          alert(response.data["message"])
          // if (response.data['message']==="Authentication failed"){
          //   alert("Invalid Credentials, please try again");
          // }else{
            if(response.data.token){
              setToken(response.data.token)
              navigate('/dashboard');
            }
          // }
        })
        .catch(function (error) {
          console.log(error, "error");
        });
      }

    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container">
      {
       fetchToken()
       ? (
        <h2>You are logged in</h2>
       )
       : (
        <h2>Login</h2>
       ) 
      }
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
