import { React, useState, useEffect } from 'react';
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
  const [result, setResult] = useState("");
  const [outputData, setOutputData] = useState("");
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState("");


  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await fetch('http://localhost:8000/databases');  
        if (!response.ok) {
          throw new Error('Failed to fetch databases');
        }

        const data = await response.json();
        setDatabases(data.databases);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDatabases();
  }, []);



  const onSubmit = async (data) => {
    try {
      const query = getValues("query");
      console.log("Your query:", String(query));

      axios.post("http://localhost:8000/schemaquery", {
        query: query,
        database: selectedDatabase,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          console.log(response);
          setResult(response.data.result);
          setOutputData(response.data.output_data);
          console.log(response.data.output_data); 
        })
        .catch(function (error) {
          console.log(error, "error");
          setOutputData("Error during query parsing");
        });
    } catch (error) {
      console.error("Error during query parsing:", error);
      setOutputData("Error during query parsing");
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

          <select
            name="database"
            value={selectedDatabase}
            onChange={(e) => setSelectedDatabase(e.target.value)}
            className="database-dropdown"
          >
            <option value="" disabled>Select Database</option>
            {databases.map((database) => (
              <option key={database} value={database}>{database}</option>
            ))}
          </select>
          <button type="submit" className="button-filled">
            Execute Query
          </button>
        </form>

        {result && (<>
          <h3>Corresponding MongoDB query</h3>
          <OutputDisplay outputText={result} />
          </>
        )}
         {/* {result && (
          <div className="output-container">
            <div className="output-text">{result}</div>
          </div>
        )} */}

        {outputData && (<>
            <h3>Result from database:</h3>
          <div className="output-container">
            <div className="output-text">{outputData}</div>
            
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuerySection;
