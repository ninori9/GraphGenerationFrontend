import React from 'react';
import PropTypes from 'prop-types';

/* library for input validation; */
import { useField } from 'formik';

/* required components; */
import InputErrorMessage from './InputErrorMessage';

const BlockInput = ({ label, info, ...props }) => {
  
  // Initialize field validation
  const [field, meta] = useField(props);

  return (
    <div className="flex flex-col flex-nowrap justify-center items-start">
      {/* Block field */}
      <span className="w-32">
        <div className="flex flex-col flex-nowrap justify-center items-start">
          <input
            id={props.name}
            {...field}
            {...props}

            className={`
            w-32 h-0 py-6 px-3 max-h-12 box-border appearance-none outline-none transition-all
            text-base font-normal text-gray-800 rounded-md disabled:cursor-not-allowed
            hover:border-gray-300 hover:outline-none hover:ring-4 hover:ring-tum hover:ring-opacity-60
            focus:border-tum focus:outline-none focus:ring-4 focus:ring-tum focus:ring-opacity-100
            ${/* Add red border if field has been touched and has error */ meta.touched && meta.error ? 'bg-fabric-light border-red-600' : 'bg-white border-tum'} `}/>
          
          {/* If current value is error, show error message */}
          {meta.error ? <InputErrorMessage msg={meta.error} /> : null}
        </div>
      </span>
    </div>
  );
};

BlockInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
BlockInput.defaultProps = {
};

export default BlockInput;