import React, {useState, useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import LinesEllipsis from 'react-lines-ellipsis'

import "./Dialog.css"
import { tx_codes, CategoryDivider } from '../../utils/Utils';


const TransactionDialog = (props) => {
  // State to display error, if transaction not well formed
  const [dialogError, setDialogError] = useState(null);

  // Validate transactions
  useEffect(() => {
    // Validate required properties, other properties either reviewed during graph creation or in other methods
    if(props.transaction.creator === undefined || props.transaction.tx_id === undefined || 
      (props.transaction.chaincode_spec !== undefined && props.transaction.chaincode_spec.chaincode === undefined) || props.transaction.tx_block_number === undefined) {
        setDialogError('Error: Transaction does not have the required structure.');
    }
    else {
      setDialogError(null);
    }
  }, [props.transaction]);


  // Get read and write keys of transaction
  const getReadWriteKeys = useMemo(() => {
    let write_keys = [];
    let read_keys = [];
    let ranges = ``;
    
    if(props.transaction.rw_set !== undefined && Array.isArray(props.transaction.rw_set)) {
      let valid = true;

      for(let i = 0; i<props.transaction.rw_set.length; i++) {
        
        // Validation if rw_set of transaction is well formed
        if(props.transaction.rw_set[i].namespace === undefined || props.transaction.chaincode_spec.chaincode === undefined || props.transaction.rw_set[i].rwset === undefined ||
          props.transaction.rw_set[i].rwset.reads === undefined || ! Array.isArray(props.transaction.rw_set[i].rwset.reads) || props.transaction.rw_set[i].rwset.writes === undefined || ! Array.isArray(props.transaction.rw_set[i].rwset.writes) ||
          props.transaction.rw_set[i].rwset.range_queries_info === undefined || ! Array.isArray(props.transaction.rw_set[i].rwset.range_queries_info)) {
            valid = false;
        }

        // Consider only rw_sets that match chaincode of transaction
        if(valid && props.transaction.rw_set[i].namespace === props.transaction.chaincode_spec.chaincode) {
          // Add reads
          for(let j=0; j<props.transaction.rw_set[i].rwset.reads.length; j++) {
            // If read key not defined, transaction not valid
            if(props.transaction.rw_set[i].rwset.reads[j].key === undefined) {
              valid = false;
              break;
            }
            read_keys.push(props.transaction.rw_set[i].rwset.reads[j].key);
            // For performance reasons not all keys need to be processed (can't be displayed in any case)
            if(j === 25) {
              break;
            }
          }
          // Add writes
          for(let j=0; j<props.transaction.rw_set[i].rwset.writes.length; j++) {
            // If write key not defined, transaction not valid
            if(props.transaction.rw_set[i].rwset.writes[j].key === undefined) {
              valid = false;
              break;
            }
            write_keys.push(props.transaction.rw_set[i].rwset.writes[j].key);
            // For performance reasons not all keys need to be processed (can't be displayed in any case)
            if(j === 25) {
              break;
            }
          }
          // Add range queries
          for(let j=0; j<props.transaction.rw_set[i].rwset.range_queries_info.length; j++) {
            // If start key or end key of range read undefined, transaction is invalid
            if(props.transaction.rw_set[i].rwset.range_queries_info[j].start_key === undefined || props.transaction.rw_set[i].rwset.range_queries_info[j].end_key === undefined) {
              valid = false;
              break;
            }
            // String representation of range read described by start and end key
            ranges += `(${props.transaction.rw_set[i].rwset.range_queries_info[j].start_key} - ${props.transaction.rw_set[i].rwset.range_queries_info[j].end_key})`;
            if(j !== props.transaction.rw_set[i].rwset.range_queries_info.length - 1) {
              ranges += `, `;
            }
          }
        }

        // If the rw_set of a transaction is not valid, return empty array --> this will lead to an error being displayed
        if(! valid) {
          return [];
        }
      }
    }
    return [read_keys, write_keys, ranges];
  }, [props.transaction]);


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
                  {/* Title */}
                  <div className='font-semibold text-lg px-4 py-2 text-center'>
                    {`Transaction ${props.transaction.tx_number}`}
                  </div>
                  {/* Divider */}
                  <div className="w-full h-px bg-tum mb-4" />

                  {/* Attributes or Error (depending on where error occured, show different text) */}
                  {dialogError !== null || getReadWriteKeys.length === 0 ? 
                    <p className='text-red-600'>{getReadWriteKeys.length === 0 ? 'Error: RW Set of transaction does not have the required structure.': dialogError}</p>
                    :
                    <div className='font-medium px-6'>
                      {/*ID and creator*/}
                      <div><b>Transaction ID: </b><LinesEllipsis maxLine='1' text={`${props.transaction.tx_id}`} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div>
                      <p><b>Creator MSPID: </b>{`${props.transaction.creator}`}</p>

                      <CategoryDivider/>

                      {/*Class and read/write sets*/}
                      <p className='pb-1'><b>Transaction class: </b>{`${props.transaction.class === undefined ? `CONFIG` : props.transaction.class}`}</p>
                      {/*Range reads (If present)*/}
                      {props.transaction.class === 'Range Query' ? <div className={`flex items-start ${getReadWriteKeys[0].length > 0 || getReadWriteKeys[1].length > 0 ? `pb-1` : ``}`}><span className='font-bold pr-2'>Read range: </span><LinesEllipsis maxLine='2' text={getReadWriteKeys[2]} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
                      {/*Reads (If present)*/}
                      {getReadWriteKeys[0].length > 0 ? <div className={`flex items-start ${getReadWriteKeys[1].length > 0 ? `pb-1` : ``}`}><span className='font-bold pr-2'>Read keys: </span><LinesEllipsis maxLine='2' text={`[${getReadWriteKeys[0].join(', ')}]`} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
                      {/*Writes (If present)*/}
                      {getReadWriteKeys[1].length > 0 ? <div className='flex flex-row'><p className='font-bold pr-2'>Write keys: </p><LinesEllipsis maxLine='2' text={`[${getReadWriteKeys[1].join(', ')}]`} ellipsis='...' trimRight basedOn='letters'></LinesEllipsis></div> : <div/>}
                      
                      <CategoryDivider/>
                      
                      {/*Block number and tx number in block*/}
                      <p><b>Block number: </b>{`${props.transaction.block_number}`}</p>
                      <p><b>Transaction number in block: </b>{`${props.transaction.tx_block_number}`}</p>

                      <CategoryDivider/>

                      {/*Chaincode and endorsers*/}
                      {props.transaction.chaincode_spec !== undefined ? <p><b>Chaincode: </b>{`${props.transaction.chaincode_spec.chaincode}`}</p> : <p/>}
                      {props.transaction.chaincode_spec !== undefined && props.transaction.chaincode_spec.chaincode !== undefined && props.transaction.chaincode_spec.chaincode !== '' && props.transaction.chaincode_spec.function !== undefined && Array.isArray(props.transaction.chaincode_spec.function) ? <p><b>Function: </b>{`${String.fromCharCode(...props.transaction.chaincode_spec.function)}`}</p> : <p/>}
                      {props.transaction.endorsements !== undefined && Array.isArray(props.transaction.endorsements) ? <p><b>Endorsing peers: </b>{`[${props.transaction.endorsements.join(', ')}]`}</p> : <p/>}
                      
                      <CategoryDivider/>
                      
                      {/*Status*/}
                      <p className={props.transaction.status === 0 ? 'text-green-800' : 'text-red-800'}><span className='font-bold'>Status: </span><span>{`${props.transaction.status} (${tx_codes[props.transaction.status]})`}</span></p>
                    </div>
                  }
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
