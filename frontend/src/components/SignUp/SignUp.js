import {React, useState} from 'react';
import './SignUp.css';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SuccessModal from '../common/SuccessModal'; 
import axios from 'axios';

const SignUp = () => {
  // const [Email, setEmail] = useState('');
  // const [UserName, setUserName] = useState("");
  // const [PassWord, setPassWord] = useState("");
  const { register, handleSubmit, errors,getValues } = useForm();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // const handleEmailChange = (event) => {
  //   setEmail(event.target.value);
  // };

  // const handleUserNameChange = (event) => {
  //   setUserName(event.target.value);
  // };

  // const handlePasswordChange = (event) => {
  //   setPassWord(event.target.value);
  // };

  const onSubmit = async (data) => {
    try 
    {
      const requestBody = {
        email : getValues('email'),
        username : getValues('username'),
        password : getValues('password')
      };

      var response = await axios.post('http://127.0.0.1:8000/users/register', requestBody,{
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data[1] === 200) {
        navigate('/login');
        console.log('User registered successfully');
        setShowModal(true);
      }
      else {
        console.error('Error during registration:', response.statusText);
      }
    } 
    catch (error) 
    {
      console.error('Error during Registration:', error);
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
            {...register('username', { required: true })}
            className="input"
          />
          {errors && errors.username && (<span className="error-message">{errors.username.message}</span>)}
        </label>
        <label className="label">
          Email:
          <input
            type="email"
            name="email"
            {...register('email', { required: true })}
            className="input"
          />
          {errors && errors.email && (<span className="error-message">{errors.email.message}</span>)}
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
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <div>
      <SuccessModal show={showModal} onHide={() => setShowModal(false)} />
    </div>
    </div>
  );
};

export default SignUp;
