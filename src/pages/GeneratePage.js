import React, { useCallback, useEffect, useState } from 'react';
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

  const [fetchedStartBlock, setFetchedStartBlock] = useState(null);
  const [fetchedEndBlock, setFetchedEndBlock] = useState(null);

  const [blockData, setBlockData] = useState({});

  // State for showing transaction and edge details dialog
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);


  const fetchingDataFunction = () => {
      setFetchingData(true);
  }

  // Get transaction details of selected transaction
  const getSelectedTransaction = () => {
    // If no selected tx return placeholder transaction
    if(blockData.transactions === null || blockData.transactions.length === 0) {
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
    if(blockData.edges === null || blockData.edges.length === 0) {
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
    let response;
    try {
        response = await ky.get(`http://localhost:3007/blockData/ggTest?startblock=${startblock}&endblock=${endblock}`, {timeout: 180000}).json();
        setFetchedStartBlock(startblock);
        setFetchedEndBlock(endblock);
        setBlockData(response);
        setFetchingData(false);
    } catch (e) {
      // TODO: Error handling?
      console.log(e);
    }
    return response;
  }


  return (
    <PageLayout>
        {/* TODO: pass function to invoke*/}
        <SetParameters setFetching={fetchingDataFunction} buttonLock={fetchingData} onSubmit={getBlockData}/>
        
        {/* If loading show loader, else show divider*/}
        {fetchingData ? <BallLoader/> :
            <div className="w-full">
                <div className="w-full h-px bg-gray-200" />
            </div>
        }

        {/* Show graph if requested and loaded*/}
        {(fetchedStartBlock == null || fetchedEndBlock == null || fetchingData) ?
            null :
            <div className='w-full'>
                <GraphHeader startblock={fetchedStartBlock} endblock={fetchedEndBlock} blockData={blockData}/>
                <TransactionConflictGraphVis transactions={blockData.transactions} edges={blockData.edges} setSelectedTransaction={setSelectedTransaction} setSelectedEdge={setSelectedEdge}/>
                <TransactionDialog isOpen={selectedTransaction!==null} transaction={getSelectedTransaction()} setIsOpen={setSelectedTransaction}/>
                <EdgeDialog isOpen={selectedEdge!==null} edge={getSelectedEdge()} setIsOpen={setSelectedEdge}/>
            </div>
        }
        <div className='h-12'/>
    </PageLayout>
  );
}

export default GeneratePage;