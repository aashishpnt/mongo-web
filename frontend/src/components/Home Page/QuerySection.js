// QuerySection.js
import React from 'react';
import { useForm } from 'react-hook-form';
import './QuerySection.css';


const QuerySection = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // form submission logic
  };

  return (
    <div className="query-section">
      <div className="query-section-container section-container">
        <h1 className="query-section-heading heading2">
          Explore Your MongoDB Database
        </h1>
        <form className="query-section-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="query"
            placeholder="Enter MongoDB query"
            {...register('Query is required', { required: true })}
          />
          {errors && errors.query && (
            <span className="error-message">{errors.query.message}</span>
          )}
          <button type="submit" className="button-filled">
            Generate Query
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuerySection;
