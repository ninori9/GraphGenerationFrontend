import React from 'react';
import PropTypes from 'prop-types';

import DownloadButton from './buttons/DownloadButton';


const GraphHeader = (props) => {
    // Transaction codes, see: https://github.com/hyperledger/fabric-protos-go/blob/main/peer/transaction.pb.go
    const tx_codes = {
        0:   "VALID",
        1:   "NIL_ENVELOPE",
        2:   "BAD_PAYLOAD",
        3:   "BAD_COMMON_HEADER",
        4:   "BAD_CREATOR_SIGNATURE",
        5:   "INVALID_ENDORSER_TRANSACTION",
        6:   "INVALID_CONFIG_TRANSACTION",
        7:   "UNSUPPORTED_TX_PAYLOAD",
        8:   "BAD_PROPOSAL_TXID",
        9:   "DUPLICATE_TXID",
        10:  "ENDORSEMENT_POLICY_FAILURE",
        11:  "MVCC_READ_CONFLICT",
        12:  "PHANTOM_READ_CONFLICT",
        13:  "UNKNOWN_TX_TYPE",
        14:  "TARGET_CHAIN_NOT_FOUND",
        15:  "MARSHAL_TX_ERROR",
        16:  "NIL_TXACTION",
        17:  "EXPIRED_CHAINCODE",
        18:  "CHAINCODE_VERSION_CONFLICT",
        19:  "BAD_HEADER_EXTENSION",
        20:  "BAD_CHANNEL_HEADER",
        21:  "BAD_RESPONSE_PAYLOAD",
        22:  "BAD_RWSET",
        23:  "ILLEGAL_WRITESET",
        24:  "INVALID_WRITESET",
        25:  "INVALID_CHAINCODE",
        254: "NOT_VALIDATED",
        255: "INVALID_OTHER_REASON",
    }

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
        console.log('To abort', str);
        return str;
    };


    const heading = props.startblock === props.endblock ? `Transaction conflict graph for block ${props.startblock}`
    : `Transaction conflict graph for blocks ${props.startblock} to ${props.endblock}`;

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

        <ul className="list-disc pl-8 pb-8 font-semibold text-lg text-black-800">
            <li>{`Total transactions: ${props.blockData.attributes.transactions}`}</li>
            <li className='text-green-800'>{`Successful transactions: ${successfulTx}`}</li>
            <li className='text-red-800'><span>{`Failed transactions: ${props.blockData.attributes.totalFailures} `}</span><span className=' text-black-800 font-medium'>{`${failureTypeString}`}</span></li>
            <li className='text-red-800'>{`Failure rate: ${failureRate}%`}</li>
            <br/>
            <li className='text-black-800'>{`Conflicts between transactions: ${props.blockData.attributes.conflicts}`}</li>
            <li className='text-red-800'>{`Conflicts leading to transaction failure: ${props.blockData.attributes.conflictsLeadingToFailure}`}</li>
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