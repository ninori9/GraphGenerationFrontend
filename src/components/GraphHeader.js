import React from 'react';
import PropTypes from 'prop-types';

import DownloadButton from './buttons/DownloadButton';


const GraphHeader = (props) => {
    const heading = props.startblock === props.endblock ? `Transaction conflict graph for block ${props.startblock}`
    : `Transaction conflict graph for blocks ${props.startblock} to ${props.endblock}`;

    const serializable = `The given set of transactions is ${props.blockData.attributes.serializable ? '' : 'not '}serializable`;
    const serializableStyle = ! props.blockData.attributes.serializable? 'text-red-900' : 'text-green-900';

    const abortText = `${props.blockData.attributes.abort} transaction${props.blockData.attributes.abort === 1 ? '' : 's'} need${props.blockData.attributes.abort === 1 ? 's' : ''} to be aborted to achieve serializability`

    const failureRate = (props.blockData.attributes.failed/props.blockData.attributes.transactions * 100).toFixed(2);

    return (
      <div className="w-full flex flex-col flex-nowrap space-y-2">
        <div className="w-full flex flex-col justify-center sm:flex-row sm:justify-between sm:space-y-0 flex-nowrap items-center">
            <div className="w-full text-xl font-semibold text-black-800 mb-4">
                {heading}
            </div>
            <DownloadButton data={props.blockData}/>
        </div>

        <ul className="list-disc pl-8 pb-8 font-semibold text-lg text-black-800">
            <li>{`Total transactions: ${props.blockData.attributes.transactions}`}</li>
            <li className='text-green-800'>{`Successful transactions: ${props.blockData.attributes.successful}`}</li>
            <li className='text-red-800'>{`Failed transactions: ${props.blockData.attributes.failed}`}</li>
            <li className='text-red-800'>{`Failure rate: ${failureRate}%`}</li>
            <br/>
            <li className={serializableStyle}>{serializable}</li>
            <li className='text-black-800 font-medium'> {abortText}</li>
        </ul>
      </div>
    );
};

GraphHeader.propTypes = {
    startblock: PropTypes.number.isRequired,
    endblock: PropTypes.number.isRequired,
    blockData: PropTypes.object.isRequired
}

export default GraphHeader;