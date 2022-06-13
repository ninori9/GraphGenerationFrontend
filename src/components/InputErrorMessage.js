import React from 'react';
import PropTypes from 'prop-types';

const InputErrorMessage = ({ msg }) => {
  return (
    <div className="w-auto py-2 text-xs text-red-600 font-medium text-left">
      {msg}
    </div>
  );
};

InputErrorMessage.propTypes = {
  msg: PropTypes.string.isRequired,
};

export default InputErrorMessage