import React from 'react';

// import CSS;
import './BallLoader.css';

const BallLoader = () => {
  return (
    <div className='font-semibold text-lg px-4 py-2 text-center text-tum'>
      <p>Fetching transaction data from the Hyperledger Fabric blockchain and creating transaction conflict graph.</p>
      <p className='pb-4'>This may take over 1 minute.</p>
      <div className="loader">
        <div className="loader-ball ball1" />
        <div className="loader-ball ball2" />
        <div className="loader-ball ball3" />
      </div>
    </div>
  );
};

export default BallLoader;