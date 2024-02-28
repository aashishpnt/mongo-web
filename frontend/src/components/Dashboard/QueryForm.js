import { React, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const OutputDisplay = ({ outputText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <div className="output-container">
      <div className="output-text">{outputText}</div>
      <button className="copy-button" onClick={handleCopyClick}>
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const QuerySection = () => {
  const { register, handleSubmit, getValues, errors } = useForm();
  const [outputText, setOutputText] = useState("");

  const onSubmit = async (data) => {
    try {
      const query = getValues("query");
      console.log("Your query:", String(query));

      axios.post("http://localhost:8000/schemaquery", {
        query: query,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          console.log(response);
          setOutputText(response.data.result); 
        })
        .catch(function (error) {
          console.log(error, "error");
          setOutputText("Error during query parsing");
        });
    } catch (error) {
      console.error("Error during query parsing:", error);
      setOutputText("Error during query parsing");
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

        {outputText && (
          <OutputDisplay outputText={outputText} />
        )}
      </div>
    </div>
  );
};

export default QuerySection;
