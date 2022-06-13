import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import "./TransactionDialog.css"

const TransactionDialog = (props) => {

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

    const title = `Transaction ${props.transaction.tx_number}`;
    const status_color = props.transaction.status === 0 ? 'text-green-800' : 'text-red-800';
    const status_text = `${props.transaction.status} (${tx_codes[props.transaction.status]})`;

    return (
        <div>
          {props.transaction === null? <div/> :
            <Modal
                isOpen={props.isOpen}
                ariaHideApp={false}
                onRequestClose={() => {props.setIsOpen(null);}}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <div>
                    {/*Title*/}
                    <div className='font-semibold text-lg text-black-800 px-8 py-2 text-center'>
                      {title}
                    </div>
                    {/*Divider*/}
                    <div className="w-full h-px bg-tum" />
                    {/*Attributes (tx_id, block, status)*/}
                    <div>
                      <p className='font-medium text-black-800 px-4 pt-2 text-ellipsis overflow-hidden'><b>tx_id: </b>{`${props.transaction.tx_id}`}</p>
                      <p className='font-medium text-black-800 px-4 text-ellipsis overflow-hidden'><b>Block number: </b>{`${props.transaction.block_number}`}</p>
                      <p className='font-medium px-4 text-ellipsis overflow-hidden'><span className='font-bold text-black-800'>Status: </span><span className={status_color}>{status_text}</span></p>
                    </div>
                </div>
            </Modal>
          }
        </div>
    );
}

TransactionDialog.propTypes = {
    transaction: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired
}

export default TransactionDialog;