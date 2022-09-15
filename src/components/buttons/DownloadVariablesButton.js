import React from "react";
import PropTypes from 'prop-types'; 

const DownloadVariablesButton = (props) => {
  const filename = `BLOCK_${props.data.startblock}-${props.data.endblock}.json`;

  const style = `appearance-none bg-fabric-blue rounded-lg box-border cursor-pointer
      flex flex-row flex-none shrink-0 grow-0 text-white font-medium text-base text-center px-4 py-2 mb-4
      hover:ring-4 hover:ring-tum hover:ring-opacity-60 focus:ring-4 focus:outline-none focus:ring-tum focus:ring-opacity-60
      font-semibold text-sm text-center inline-flex items-center`;

  return (
    <a
      type="button"
      href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(props.data))}`}
      download={filename}
      className={style}>
      <svg 
          className="fill-white"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false">
          <path d="M0 0h24v24H0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
      </svg>
      <div className="w-4"/>
      Download Graph Variables
    </a>
  );
};


DownloadVariablesButton.propTypes = {
    data: PropTypes.object.isRequired,
};

export default DownloadVariablesButton;