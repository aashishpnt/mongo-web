// QuerySection.js
import {React, useState} from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './QuerySection.css';


const QuerySection = () => {
  const { register, handleSubmit, getValues, errors } = useForm();
  // const [query, setquery] = useState("");

  // const handleEmailChange = (event) => {
  //   let userdata=event.target.value;
  //   setquery(userdata);
  // };

  var query = "kaustuib"

  const onSubmit = async (data) => {
    try  {
      // console.log(data);
      const query = getValues("query");
      console.log("your query:", String("query"));
    axios.post("http://localhost:8000/processQuery", {
      query : query,
    },{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log(response);
      alert(response.data["message"])
    })
    .catch(function (error) {
      console.log(error, "error");
    });

    // const response = await fetch('http://localhost:8000/processQuery', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/string',
    //     },
    //     body: JSON.stringify({ query }),
    //   });

  } catch (error) {
    console.error("Error during query parsing:", error);
  }
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
            placeholder="Enter NL Query"
            {...register('query', { required: true })}
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
