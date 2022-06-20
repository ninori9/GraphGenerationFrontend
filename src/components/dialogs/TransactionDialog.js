import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import "./TransactionDialog.css"

const TransactionDialog = (props) => {
    const show_write = props.transaction.class === 'Update' || props.transaction.class === 'Write-only';
    const show_read = props.transaction.class === 'Update' || props.transaction.class === 'Read.only';


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

    const get_endorsers_text = function() {
      console.log('transaction.endorsements', props.transaction.endorsements);
      let endorsers_text = `[`;
      for(let i=0; i<props.transaction.endorsements.length; i++) {
        endorsers_text += `${props.transaction.endorsements[i].endorser.Mspid}`
        if(i < props.transaction.endorsements.length - 1) {
          endorsers_text += `, `
        }
      }
      endorsers_text += `]`;
      return endorsers_text;
    };

    /*const get_class_text = function() {
      let ct = ``;
      if(props.transaction.class === 'Update') {
        ct += `(${props.transaction.rw_set.})`
      }
    };

    const get_writes = function() {

    };

    const get_reads = function() {

    };

    const get_range_reads = function() {

    };*/

    const endorsement_text = get_endorsers_text();

    return (
        <div>
          {props.transaction === null ? <div/> :
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
                      <p className='font-medium text-black-800 px-4 pt-2 text-ellipsis overflow-hidden'><b>Transaction ID: </b>{`${props.transaction.tx_id} ${props.transaction.tx_id}`}</p>
                      <p className='font-medium text-black-800 px-4 pt-2 text-ellipsis overflow-hidden'><b>Creator MSPID: </b>{`${props.transaction.creator.Mspid}`}</p>
                      <br/>
                      <p className='font-medium text-black-800 px-4 pt-2 text-ellipsis overflow-hidden'><b>Transaction class: </b>{`${props.transaction.class}`}</p>
                      {/*TODO: Write, read, range read set + max lines*/}
                      <br/>
                      <p className='font-medium text-black-800 px-4 text-ellipsis overflow-hidden'><b>Block number: </b>{`${props.transaction.block_number}`}</p>
                      <p className='font-medium text-black-800 px-4 text-ellipsis overflow-hidden'><b>Transaction number in block: </b>{`${props.transaction.tx_block_number}`}</p>
                      <br/>
                      <p className='font-medium text-black-800 px-4 text-ellipsis overflow-hidden'><b>Chaincode: </b>{`${props.transaction.chaincode_spec.chaincode_id.name}`}</p>
                      <p className='font-medium text-black-800 px-4 text-ellipsis overflow-hidden'><b>Endorsing peers: </b>{`${endorsement_text}`}</p>
                      <br/>
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