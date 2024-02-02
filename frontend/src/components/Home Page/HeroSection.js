import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero">
      <h1 className="heading">MongoGen</h1>
      <span className="sub-heading">Query efficiently with the help of AI</span>
      
      <div className="btn-group">
        <button className="filled">Get Started</button>
        <div className="btn-space" />
        <button className="flat">Learn More →</button>
      </div>
    </div>
  );
};

export default HeroSection;
