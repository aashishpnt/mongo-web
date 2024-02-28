// QueryOutput.js (React component)
import React, { useState, useEffect } from 'react';
import './UserSchema.css'

const QueryOutput = () => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [fields, setFields] = useState([]);

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

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`http://localhost:8000/collections/${selectedDatabase}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = await response.json();
        setCollections(data.collections);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedDatabase) {
      fetchCollections();
    }
  }, [selectedDatabase]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(`http://localhost:8000/fields/${selectedDatabase}/${selectedCollection}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch fields');
        }

        const data = await response.json();
        setFields(data.fields);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedDatabase && selectedCollection) {
      fetchFields();
    }
  }, [selectedDatabase, selectedCollection]);

  const handleDatabaseClick = (database) => {
    setSelectedDatabase((prevSelectedDatabase) =>
      prevSelectedDatabase === database ? '' : database
    );
    setSelectedCollection('');
    setFields([]);
  };
  
  const handleCollectionClick = (collection) => {
    setSelectedCollection((prevSelectedCollection) =>
      prevSelectedCollection === collection ? '' : collection
    );
  };

  return (
    <>

    <div className="query-output">
      <h1>Your DB schema</h1>
      <h2>Databases</h2>
      <ul>
        {databases.map((database) => (
          <li key={database}>
            <span onClick={() => handleDatabaseClick(database)} style={{ cursor: 'pointer' }}>
              {selectedDatabase === database ? '-' : '+'} {database}
            </span>
          
            {selectedDatabase === database && (
              <ul className="sublist">
                  {collections && collections.length > 0 ? (
                    collections.map((collection) => (
                      <li key={collection}>  
                      <span onClick={() => handleCollectionClick(collection)} style={{ cursor: 'pointer' }}>
                      {selectedCollection === collection ? '-' : '+'} {collection}
                    </span>

                    {selectedCollection === collection && (
                          <ul className="sublist">
                            {fields && fields.length > 0 ? (
                              fields.map((field) => (
                                <li key={field}>{field}</li>
                              ))
                            ) : (
                              <li>No fields available</li>
                            )}
                          </ul>
                        )}
                    </li>
                    ))
                  ) : (
                    <li>No collections available</li>
                  )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
    
    </>
  );
};

export default QueryOutput;
