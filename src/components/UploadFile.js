import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import LinesEllipsis from 'react-lines-ellipsis'

import graphlogo from './images/logoTest.png'
import GenerateButton from './buttons/GenerateButton';



const UploadFile = (props) => {
    // File name of uploaded file
    const [filename, setFilename] = useState(null);

    // Error detected for uploaded file
    const [error, setError] = useState(null);

    // Data contained in uploaded file
    const [jsonData, setJsonData] = useState(null);

    // Generate button lock
    const [buttonLock, setButtonLock] = useState(true);

    // Reference to hidden input component
    const fileInputRef = useRef(null);


    // Method called when upload button is clicked
    const handleClick = () => {
        // Prior data is removed
        setJsonData(null);

        // Disable graph in parent
        props.onGenerate(null);

        setFilename(null);
        setError(null);
        // Further processing is handled by the hidden input component
        fileInputRef.current.click();
    };

    const handleChange = event => {
        // File read by file reader
        const fr = new FileReader();
        const uploadedFile = event.target.files[0];

        // Maximum file size is currently 5MB
        if(uploadedFile.size > 5000000) {
            setError('Error: File too big.');
        }
        // File type must be .json
        else if(uploadedFile.type !== "application/json") {
            setError('Error: The uploaded file has a wrong type.');
        }
        else {
            setFilename(uploadedFile.name);
            fr.readAsText(uploadedFile);

            fr.onload = e => {
                try {
                    // Parsing and verifying basic structure of file
                    const object = JSON.parse(e.target.result);
                    if(! verifyJson(object)) {
                        setError('Error: File does not have the required strucure.')
                    }
                    else {
                        // If all checks pass, set data and unlock generate button
                        setButtonLock(false);
                        setJsonData(object);
                    }
                } catch(error) {
                    // Could not parse JSON file
                    setError('Error: Could not parse the provided file.');
                }
            }
        }
    };


    // Verify basic structure of uploaded file
    const verifyJson = (json) => {
        return (json.attributes !== undefined && json.edges !== undefined && Array.isArray(json.edges) && json.transactions !== undefined && Array.isArray(json.transactions) && 
            json.attributes.startblock !== undefined && ! isNaN(parseInt(json.attributes.startblock)) && json.attributes.endblock !== undefined && ! isNaN(parseInt(json.attributes.endblock)) &&
            json.attributes.serializable !== undefined && json.attributes.needToAbort !== undefined &&
            json.attributes.conflicts !== undefined && json.attributes.conflictsLeadingToFailure !== undefined && json.attributes.transactions !== undefined &&
            json.attributes.totalFailures !== undefined && json.attributes.failureTypes !== undefined && Array.isArray(json.attributes.failureTypes)
        );
    }

    // Upload button style
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
            {/*Upload button*/}
            <button 
                className={buttonStyle}
                onClick={handleClick}>
                Upload JSON
            </button>
            {/*Input component (not displayed, but handles logic related to upload)*/}
            <input id='graphFile' ref={fileInputRef} type='file' onChange={handleChange} accept='.json' style={{display:'none'}}></input>
            {/*File name (if present)*/}
            {filename !== null ? <div className='text-black-600'><LinesEllipsis maxLine='1' text={filename} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
            {/*Error (if present)*/}
            {error !== null ? <p className='text-red-600'>{error}</p> : <div/>}
        </div>

        {/* Generate button */}
        <GenerateButton isValid={error === null && filename !== null} onClick={jsonData !== null ? () => { props.onGenerate(jsonData); setButtonLock(true); } : () => {}} lock={buttonLock}/>
      </div>
    );
};


UploadFile.propTypes = {
    onGenerate: PropTypes.func.isRequired,
}


export default UploadFile;
