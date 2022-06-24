import React, { useState } from 'react';
import ky from 'ky';

import BallLoader from '../components/loader/BallLoader';
import SetParameters from '../components/SetParamters';
import GraphHeader from '../components/GraphHeader';
import PageLayout from '../components/PageLayout';
import TransactionConflictGraphVis from '../components/TransactionConflictGraphVis';
import TransactionDialog from '../components/dialogs/TransactionDialog';

import { placeholder_tx, placeholder_edge } from '../utils/Utils';
import EdgeDialog from '../components/dialogs/EdgeDialog';

const GeneratePage = () => {
  // Flag that is 'true' if fetching in progress
  const [fetchingData, setFetchingData] = useState(false);

  const [blockData, setBlockData] = useState(null);

  const [error, setError] = useState(null);

  // State for showing transaction and edge details dialog
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);


  const fetchingDataFunction = () => {
      setFetchingData(true);
  }

  // Get transaction details of selected transaction
  const getSelectedTransaction = () => {
    // If no selected tx return placeholder transaction
    if(blockData.transactions === undefined || blockData.transactions.length === 0) {
        return placeholder_tx;
    }
    else {
        const matchingTxs = blockData.transactions.filter(tx => tx.tx_number === selectedTransaction);
        if(matchingTxs.length === 0) {
            return placeholder_tx;
        }
        else {
            return matchingTxs[0];
        }
    }
  };

  // Get transaction details of selected edge
  const getSelectedEdge = () => {
    // If no selected edge return placeholder edge
    if(blockData.edges === undefined || blockData.edges.length === 0) {
        return placeholder_edge;
    }
    else {
        const matchingEdges = blockData.edges.filter(edge => edge.edge_number === selectedEdge);
        if(matchingEdges.length === 0) {
            return placeholder_edge;
        }
        else {
            return matchingEdges[0];
        }
    }
  };

  const getBlockData = async (startblock, endblock) => {
    setError(null);
    let response;
    try {
        response = await ky.get(`http://localhost:3007/blockData/graphGeneration?startblock=${startblock}&endblock=${endblock}`, {timeout: 180000}).json();
        setBlockData(response);
        setFetchingData(false);
    } catch (e) {
        console.log(e);

        // Try to handle error by displaying the custom error message
        try {
            // An error may occur at this point
            const errorBody = await e.response.json();
            console.log('errorBody', errorBody);

            if(errorBody.error === undefined) {
                setError(`Error: ${e.message}`)
            }
            else {
                const errorMessage = `Error: ${errorBody.error}`;
                setError(errorMessage);
            }
        }
        // If error can't be parsed display HTTPError message
        catch(err) {
            setError(e.message);
        }
        setBlockData(null);
        setFetchingData(false);
    }
    return response;
  }


  return (
    <PageLayout>
        {/*Component at top of page (set start block and end block)*/}
        <SetParameters setFetching={fetchingDataFunction} buttonLock={fetchingData} onSubmit={getBlockData}/>
        
        {/* If loading show loader, else show divider*/}
        {fetchingData ? <BallLoader/> :
            <div className="w-full">
                <div className="w-full h-px bg-gray-200" />
            </div>
        }

        {/* Show graph if requested and loaded*/}
        {(blockData === null || fetchingData) ?
            null :
            <div className='w-full'>
                <GraphHeader startblock={parseInt(blockData.attributes.startblock)} endblock={parseInt(blockData.attributes.endblock)} blockData={blockData}/>
                <TransactionConflictGraphVis transactions={blockData.transactions} edges={blockData.edges} setSelectedTransaction={setSelectedTransaction} setSelectedEdge={setSelectedEdge}/>
                <TransactionDialog isOpen={selectedTransaction!==null} transaction={getSelectedTransaction()} setIsOpen={setSelectedTransaction}/>
                <EdgeDialog isOpen={selectedEdge!==null} edge={getSelectedEdge()} setIsOpen={setSelectedEdge}/>
            </div>
        }

        {/* If error occured fetching data, show error */}
        {error !== null ? <div className='w-full'><p className='text-red-600 font-semibold text-lg px-4 py-4 text-center'>{error}</p></div> : null}

        <div className='h-12'/>
    </PageLayout>
  );
}

export default GeneratePage;
