import React from 'react';
import PropTypes from 'prop-types';

import graphlogo from './images/logoTest.png'
import StartEndBlockForm from './StartEndBlockForm';


const SetParameters = (props) => {

    return (
      <div className="w-full flex flex-col flex-nowrap space-y-4 items-center p-12 bg-gray-100">
        
        {/* Logo */}
        <div
          className="w-28 h-28 rounded-full bg-center bg-no-repeat bg-cover">
          <img className='object-cover w-28 h-28' src={graphlogo} alt='Fabric'/>
        </div>
        

        {/* Title and description */}
        <div className="flex flex-col flex-nowrap justify-center items-center space-y-1">
          <div className="text-2xl text-gray-800 text-center font-medium">
            TRANSACTION CONFLICT GRAPH GENERATOR
          </div>
          <div className="text-gray-600 text-center text-base">
            Specify a range of blocks on the Hyperledger Fabric distributed ledger for which a transaction conflict graph should be generated.
          </div>
        </div>

        {/* Start and end block input and generate button */}
        <StartEndBlockForm setFetching={props.setFetching} buttonLock={props.buttonLock} onSubmit={props.onSubmit}/>

      </div>
    );
};

SetParameters.propTypes = {
  setFetching: PropTypes.func.isRequired,
  buttonLock: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default SetParameters;