import React from 'react';

// import CSS;
import './BallLoader.css';

const BallLoader = () => {
  return (
    <div className="loader">
      <div className="loader-ball ball1" />
      <div className="loader-ball ball2" />
      <div className="loader-ball ball3" />
    </div>
  );
};

export default BallLoader;