import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import "./Dialog.css";
import { CategoryDivider } from "../../utils/Utils";


const EdgeDialog = (props) => {

    return (
        <div>
          {props.edge === null ? <div/> :
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
                      Edge Details
                    </div>
                    {/*Divider*/}
                    <div className="w-full h-px bg-tum mb-4" />
                    {/*Attributes or error (occurs if key overlap not well formed, other attributes checked during graph creation)*/}
                    {props.edge.key_overlap === undefined || ! Array.isArray(props.edge.key_overlap) ? 
                      <p className='text-red-600'>Error: Key overlap of edge does not have the required structure.</p>
                      :
                      <div className='font-medium px-6'>
                      {/*From, To*/}
                      <p><b>From: </b>{`Transaction ${props.edge.from}`}</p>
                      <p><b>To: </b>{`Transaction ${props.edge.to}`}</p>

                      <CategoryDivider/>
                      
                      {/*Keys and Failure*/}
                      <p className='pb-1'><b>Keys causing dependency: </b>{`[${props.edge.key_overlap.join(', ')}]`}</p>
                      <p className={`text-${props.edge.reason_for_failure? `red` : `green`}-800`}><b>Reason for transaction failure: </b>{props.edge.reason_for_failure? `TRUE` : `FALSE`}</p>
                    </div>
                    }
                </div>
            </Modal>
          }
        </div>
    );
};

EdgeDialog.propTypes = {
    edge: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired
}
  
export default EdgeDialog;