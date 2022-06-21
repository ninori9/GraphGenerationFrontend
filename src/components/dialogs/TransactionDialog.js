import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import LinesEllipsis from 'react-lines-ellipsis'

import "./Dialog.css"
import { tx_codes, CategoryDivider } from '../../utils/Utils';


const TransactionDialog = (props) => {

  // Get read and write keys of transaction
  let write_keys = [];
  let read_keys = [];
  let ranges = ``;

  for(let i = 0; i<props.transaction.rw_set.length; i++) {
    if(props.transaction.rw_set[i].namespace === props.transaction.chaincode_spec.chaincode_id.name) {
      // Add reads
      for(let j=0; j<props.transaction.rw_set[i].rwset.reads.length; j++) {
        read_keys.push(props.transaction.rw_set[i].rwset.reads[j].key);
      }
      // Add writes
      for(let j=0; j<props.transaction.rw_set[i].rwset.writes.length; j++) {
        write_keys.push(props.transaction.rw_set[i].rwset.writes[j].key);
      }
      // Add ranges
      for(let j=0; j<props.transaction.rw_set[i].rwset.range_queries_info.length; j++) {
        ranges += `(${props.transaction.rw_set[i].rwset.range_queries_info[j].start_key} - ${props.transaction.rw_set[i].rwset.range_queries_info[j].end_key})`;
        if(j !== props.transaction.rw_set[i].rwset.range_queries_info.length - 1) {
          ranges += `, `;
        }
      }
    }
  }

  const get_endorsers_text = function() {
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
              <div className='text-black-800'>
                  {/*Title*/}
                  <div className='font-semibold text-lg px-4 py-2 text-center'>
                    {title}
                  </div>
                  {/*Divider*/}
                  <div className="w-full h-px bg-tum mb-4" />
                  {/*Attributes*/}
                  <div className='font-medium px-6'>
                    <div><b>Transaction ID: </b><LinesEllipsis maxLine='1' text={`${props.transaction.tx_id}`} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div>
                    <p><b>Creator MSPID: </b>{`${props.transaction.creator.Mspid}`}</p>
                    <CategoryDivider/>
                    {/*Class and read/write sets*/}
                    <p className='pb-1'><b>Transaction class: </b>{`${props.transaction.class}`}</p>
                    {props.transaction.class === 'Range Query' ? <div className={`flex items-start ${read_keys.length > 0 || write_keys.length > 0 ? `pb-1` : ``}`}><span className='font-bold pr-2'>Read range: </span><LinesEllipsis maxLine='2' text={ranges} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
                    {read_keys.length > 0 ? <div className={`flex items-start ${write_keys.length > 0 ? `pb-1` : ``}`}><span className='font-bold pr-2'>Read keys: </span><LinesEllipsis maxLine='2' text={`[${read_keys.join(', ')}]`} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
                    {write_keys.length > 0 ? 
                      <div className='flex flex-row'><p className='font-bold pr-2'>Write keys: </p><LinesEllipsis maxLine='2' text={`[${write_keys.join(', ')}]`} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
                    <CategoryDivider/>
                    {/*Block number and tx number in block*/}
                    <p><b>Block number: </b>{`${props.transaction.block_number}`}</p>
                    <p><b>Transaction number in block: </b>{`${props.transaction.tx_block_number}`}</p>
                    <CategoryDivider/>
                    {/*Chaincode and endorsers*/}
                    <p><b>Chaincode: </b>{`${props.transaction.chaincode_spec.chaincode_id.name}`}</p>
                    <p><b>Endorsing peers: </b>{`${endorsement_text}`}</p>
                    <CategoryDivider/>
                    {/*Status*/}
                    <p className={status_color}><span className='font-bold'>Status: </span><span>{status_text}</span></p>
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