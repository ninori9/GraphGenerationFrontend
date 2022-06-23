import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';

import graphlogo from './images/logoTest.png'
import GenerateButton from './buttons/GenerateButton';



const UploadFile = (props) => {
    const [filename, setFilename] = useState(null);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData] = useState(null);

    const fileInputRef = useRef(null);

    const handleClick = () => {
        setJsonData(null);
        
        // Disable graph in parent
        props.onGenerate(null);

        setFilename(null);
        setError(null);
        fileInputRef.current.click();
    };

    const handleChange = event => {
        const fr = new FileReader();

        const uploadedFile = event.target.files[0];

        // Maximum file size is currently approx. 200kb, which is about 10x larger than avg file size
        if(uploadedFile.size > 200000) {
            setError('Error: File too big.');
        }
        else if(uploadedFile.type !== "application/json") {
            setError('Error: The uploaded file has a wrong type.');
        }
        else {
            setFilename(uploadedFile.name);
            fr.readAsText(uploadedFile);

            fr.onload = e => {
                const object = JSON.parse(e.target.result);
                if(! verifyJson(object)) {
                    setError('Error: File does not have the required strucure.')
                }
                else {
                    setJsonData(object);
                }
            }
        }
    };


    const verifyJson = (json) => {
        // Verify basic structure
        return (json.attributes !== undefined && json.edges !== undefined && Array.isArray(json.edges) && json.transactions !== undefined && Array.isArray(json.transactions) && 
            json.attributes.startblock !== undefined && parseInt(json.attributes.startblock) !== NaN && json.attributes.endblock !== undefined && parseInt(json.attributes.endblock) !== NaN &&
            json.attributes.serializable !== undefined && json.attributes.needToAbort !== undefined &&
            json.attributes.conflicts !== undefined && json.attributes.conflictsLeadingToFailure !== undefined && json.attributes.transactions !== undefined &&
            json.attributes.totalFailures !== undefined && json.attributes.failureTypes !== undefined && Array.isArray(json.attributes.failureTypes)
        );
    }

    const buttonStyle = `appearance-none bg-fabric rounded-md box-border cursor-pointer
        flex flex-row flex-none shrink-0 grow-0
        text-white font-medium text-base text-center px-4 py-2 mb-1 mt-2
        hover:ring-1 hover:ring-tum hover:ring-opacity-60
        focus:ring-1 focus:outline-none focus:ring-tum focus:ring-opacity-60
        font-semibold text-sm text-center inline-flex items-center`;


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
            TRANSACTION CONFLICT GRAPH VISUALIZER
          </div>
          <div className="text-gray-600 text-center text-base">
            Upload the .json file of a previously generated transaction conflict graph.
          </div>
        </div>

        {/* Upload file button */}
        <div className='flex flex-col items-center pb-4'>
            <button 
                className={buttonStyle}
                onClick={handleClick}>
                Upload JSON
            </button>
            <input id='graphFile' ref={fileInputRef} type='file' onChange={handleChange} accept='.json' style={{display:'none'}}></input>
            {filename !== null ? <p className='text-black-600'>{filename}</p> : <div/>}
            {error !== null ? <p className='text-red-600'>{error}</p> : <div/>}
        </div>

        {/* Generate button */}
        <GenerateButton isValid={error === null && filename !== null} onClick={jsonData !== null ? () => { props.onGenerate(jsonData); } : () => {}} lock={false}/>
      </div>
    );
};


UploadFile.propTypes = {
    onGenerate: PropTypes.func.isRequired,
}


export default UploadFile;