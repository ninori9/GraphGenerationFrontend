import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import LinesEllipsis from 'react-lines-ellipsis'

import "./TransactionDialog.css"
import { tx_codes } from '../../utils/Utils';


const TransactionDialog = (props) => {

  // Get read and write keys of 
  const show_sets = function() {
    let write_keys = [];
    let read_keys = [];

    for(let i = 0; i<props.transaction.rw_set.length; i++) {
      if(props.transaction.rw_set[i].namespace === props.transaction.chaincode_spec.chaincode_id.name) {
        // Add reads
        for(let j=0; i<props.transaction.rw_set[i].rwset.reads.length; j++) {
          read_keys.push(props.transaction.rw_set[i].rwset.reads[j].key);
        }
        // Add writes
        for(let j=0; i<props.transaction.rw_set[i].rwset.reads.length; j++) {
          write_keys.push(props.transaction.rw_set[i].rwset.writes[j].key);
        }
      }
    }
    return {writes: write_keys, reads: read_keys};
  };

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

  const title = `Transaction ${props.transaction.tx_number}`;
  const status_color = props.transaction.status === 0 ? 'text-green-800' : 'text-red-800';
  const status_text = `${props.transaction.status} (${tx_codes[props.transaction.status]})`;
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
                    <p className='font-medium text-black-800 px-4 pt-2 text-ellipsis overflow-hidden'><LinesEllipsis text='long long te iojiofjeiofj eijfijiejf eiufjeriufjriufjerijfu ierjfiujeruif jeruifjeurjfuerj ferifjeriu f jeruifjreufjuerjfiuerjfuirejferiufjeriujui jfir jij im riej iu jeuj reiuj reiu j' maxLine='1'
  ellipsis='...'
  trimRight
  basedOn='letters'>
                      </LinesEllipsis> </p>
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