import React, {useState} from 'react';

import PageLayout from '../components/PageLayout';
import UploadFile from '../components/UploadFile';

import GraphHeader from '../components/GraphHeader';
import TransactionConflictGraphVis from '../components/TransactionConflictGraphVis';
import TransactionDialog from '../components/dialogs/TransactionDialog';
import EdgeDialog from '../components/dialogs/EdgeDialog';

import { placeholder_tx, placeholder_edge } from '../utils/Utils';


const VisualizePage = () => {
    // Transaction conflict graph data from json
    const [blockData, setBlockData] = useState(null);

    // State for showing transaction and edge details dialog
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);

    // Error displayed if transaction graph turns out not to be valid
    const [error, setError] = useState(null);
    // Graph header rendered only if graph valid
    const [renderGraphHeader, setRenderGraphHeader] = useState(false);

    // If error at graph, do not render header, remove block data
    const onGraphError = (error) => {
        setRenderGraphHeader(false);
        setBlockData(null);
        setError(error);
    };

    // If generate button pressed, set block data
    const onGenerate = (data) => {
        setRenderGraphHeader(false);
        setBlockData(data);
        setError(null);
    }

    // Get transaction details of selected transaction
    const getSelectedTransaction = () => {
        // If no selected tx return placeholder transaction
        if(blockData.transactions === null || blockData.transactions.length === 0) {
            return placeholder_tx;
        }
        else {
            const matchingTxs = blockData.transactions.filter(tx => tx.tx_number !== undefined && tx.tx_number === selectedTransaction);
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
            const matchingEdges = blockData.edges.filter(edge => edge.edge_number !== undefined && edge.edge_number === selectedEdge);
            if(matchingEdges.length === 0) {
                return placeholder_edge;
            }
            else {
                return matchingEdges[0];
            }
        }
    };


    return (
        <PageLayout>
            {/*Component at top of page (upload file)*/}
            <UploadFile onGenerate={onGenerate}/>

            {/* Show graph if block data loaded*/}
            {(blockData === null) ?
                null :
                <div className='w-full'>
                    {renderGraphHeader ? <GraphHeader startblock={parseInt(blockData.attributes.startblock)} endblock={parseInt(blockData.attributes.endblock)} blockData={blockData}/> : null }
                    <TransactionConflictGraphVis transactions={blockData.transactions} edges={blockData.edges} setSelectedTransaction={setSelectedTransaction} setSelectedEdge={setSelectedEdge} setError={onGraphError} setRenderHeader={setRenderGraphHeader}/>
                    <TransactionDialog isOpen={selectedTransaction!==null} transaction={getSelectedTransaction()} setIsOpen={setSelectedTransaction}/>
                    <EdgeDialog isOpen={selectedEdge!==null} edge={getSelectedEdge()} setIsOpen={setSelectedEdge}/>
                </div>
            }

            {/* Show error detail if error occured in graph generation */}
            {(error === null) ?
                null : <div className='w-full'><p className='text-red-600 font-semibold text-lg px-4 py-4 text-center'>{error}</p></div>
            }

            <div className='h-12'/>
        </PageLayout>
    );
}

export default VisualizePage;