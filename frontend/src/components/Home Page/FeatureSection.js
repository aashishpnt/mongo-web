import React from 'react';
import PropTypes from 'prop-types';
import './FeatureSection.css';
import { FcAcceptDatabase } from 'react-icons/fc';
import { MdInput } from 'react-icons/md';

const Features = ({ logo, heading, subHeading }) => {
  return (
    <div className="features">
      {logo}
      <div className="feature-content">
        <h3 className="feature-heading">{heading}</h3>
        <span className="feature-sub-heading">{subHeading}</span>
      </div>
    </div>
  );
};

Features.propTypes = {
  logo: PropTypes.element.isRequired,
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string.isRequired,
};

const FeatureSection = () => {
  const features = [
    {
      logo: <MdInput size={50} />,
      heading: 'Input MongoDB Query',
      subHeading: 'Enter your MongoDB query in the text box',
    },
    {
      logo: <FcAcceptDatabase size={50} />,
      heading: 'Query Execution',
      subHeading: 'Execute the query and retrieve data from MongoDB server',
    },
    {
      logo: <FcAcceptDatabase size={50} />, // Add your next logo component here
      heading: 'Output JSON',
      subHeading: 'View the output of the query in JSON format',
    },
    {
      logo: <FcAcceptDatabase size={50} />, // Add your next logo component here
      heading: 'Database Integration',
      subHeading: 'Seamlessly connect to your MongoDB database for querying',
    },
  ];

  return (
    <div className="feature-section" id='features'>
      <div className="feature-section-container">
        <div className="feature-section-heading">
          <span className="overline"><h1>Features</h1></span>
          <h2 className="feature-section-main-heading">
            Powerful Features for Efficient Querying
          </h2>
          <span className="feature-section-sub-heading">
            Experience the ease of retrieving data from MongoDB with MongoGen
          </span>
        </div>
        <div className="feature-section-cards">
          {features.map((feature, index) => (
            <Features key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
