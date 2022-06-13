import React from 'react';
import PropTypes from 'prop-types';

const GenerateButton = ({ onClick, isValid, lock }) => {
  
  const style = `appearance-none bg-tum rounded-lg box-border cursor-pointer transition select-none
    flex flex-none flex-row justify-center items-center px-4 py-2
    text-base text-white font-medium text-center
    hover:bg-tum-dark hover:outline-none hover:ring-4 hover:ring-fabric hover:ring-opacity-60
    focus:outline-none focus:ring-4 focus:ring-fabric focus:ring-opacity-60
    active:bg-tum-darkest active:outline-none active:ring-4 active:ring-fabric active:ring-opacity-100
    disabled:opacity-50 disabled:bg-tum disabled:outline-none disabled:ring-0 disabled:ring-transparent disabled:hover:ring-opacity-0 disabled:cursor-not-allowed`;

  return (
    <button
      type="submit"
      onClick={onClick}
      className={style}
      disabled={(! isValid || lock)}
    >
      Generate
    </button>
  );
};

GenerateButton.defaultProps = {
  disabled: false,
};

GenerateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  lock: PropTypes.bool,
};

export default GenerateButton;
