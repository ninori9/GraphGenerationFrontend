import React from 'react';
import PropTypes from 'prop-types';

import DownloadButton from './buttons/DownloadButton';
import { tx_codes } from '../utils/Utils';


const GraphAttributeDivider = () => {
  return (
    <div className="w-full">
    <div className="w-full h-px bg-gray-200 my-4 pr-8" />
    </div>
  );
};


const GraphHeader = (props) => {

    const getFailureTypeString = function() {
        let res = `(`;
        for(let i =0; i<props.blockData.attributes.failureTypes.length; i++) {
            res += `${props.blockData.attributes.failureTypes[i][1]}x ` + `${tx_codes[props.blockData.attributes.failureTypes[i][0]]}`;
            if(i < props.blockData.attributes.failureTypes.length -1) {
                res += `, `;
            }
        }
        res += `)`;
        return res;
    };

    const getTransactionsToAbortString = function() {
        let str = ``;
        for(let i = 0; i<props.blockData.attributes.needToAbort.length; i++) {
            if(i === 0) {
                str += ` (`;
            }
            str += `Tx${props.blockData.attributes.needToAbort[i]}`
            if(i < props.blockData.attributes.needToAbort.length - 1) {
                str += `, `;
            }
            if(i === props.blockData.attributes.needToAbort.length - 1) {
                str += `)`;
            }
        }
        return str;
    };


    const heading = props.startblock === props.endblock ? `Transaction conflict graph for block ${props.startblock}` : `Transaction conflict graph for blocks ${props.startblock} to ${props.endblock}`;

    const serializable = `The given set of transactions is ${props.blockData.attributes.serializable ? '' : 'not '}serializable`;
    const serializableStyle = ! props.blockData.attributes.serializable? 'text-red-900' : 'text-green-900';

    const abortedTxText = getTransactionsToAbortString();
    const abortText = `${props.blockData.attributes.needToAbort.length} transaction${props.blockData.attributes.needToAbort.length === 1 ? '' : 's'}${abortedTxText} need${props.blockData.attributes.needToAbort.length === 1 ? 's' : ''} to be aborted to achieve serializability`;

    const failureRate = (props.blockData.attributes.totalFailures/props.blockData.attributes.transactions * 100).toFixed(2);
    const failureTypeString = getFailureTypeString();

    const successfulTx = props.blockData.attributes.transactions - props.blockData.attributes.totalFailures;

    return (
      <div className="w-full flex flex-col flex-nowrap space-y-2">
        <div className="w-full flex flex-col justify-center sm:flex-row sm:justify-between sm:space-y-0 flex-nowrap items-center">
            <div className="w-full text-xl font-semibold text-black-800 mb-4">
                {heading}
            </div>
            <DownloadButton data={props.blockData}/>
        </div>

        <ul className="list-disc pl-8 pr-8 pb-8 font-semibold text-lg text-black-800">
            <li>{`Total transactions: ${props.blockData.attributes.transactions}`}</li>
            <li className='text-green-800'>{`Successful transactions: ${successfulTx}`}</li>
            <li className='text-red-800'><span>{`Failed transactions: ${props.blockData.attributes.totalFailures} `}</span><span className='font-medium'>{`${failureTypeString}`}</span></li>
            <li className='text-red-800'>{`Failure rate: ${failureRate}%`}</li>
            <GraphAttributeDivider/>
            <li>
                <span>{`Conflicts between transactions: ${props.blockData.attributes.conflicts} `}</span>
                <span className={`${props.blockData.attributes.conflictsLeadingToFailure == 0 ? `text-green-800` : `text-red-800`} font-medium`}>{`(${props.blockData.attributes.conflictsLeadingToFailure} conflicts leading to transaction failure)`}</span>
            </li>
            <GraphAttributeDivider/>
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