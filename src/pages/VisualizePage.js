import React, {useState} from 'react';

import PageLayout from '../components/PageLayout';
import UploadFile from '../components/UploadFile';

import GraphHeader from '../components/GraphHeader';
import TransactionConflictGraphVis from '../components/TransactionConflictGraphVis';
import TransactionDialog from '../components/dialogs/TransactionDialog';
import EdgeDialog from '../components/dialogs/EdgeDialog';

import { placeholder_tx, placeholder_edge } from '../utils/Utils';


const VisualizePage = () => {
    const [blockData, setBlockData] = useState(null);

    // State for showing transaction and edge details dialog
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);


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
            <UploadFile onGenerate={setBlockData}/>

            {/* Show graph if block data loaded*/}
            {(blockData === null) ?
                null :
                <div className='w-full'>
                    <GraphHeader startblock={parseInt(blockData.attributes.startblock)} endblock={parseInt(blockData.attributes.endblock)} blockData={blockData}/>
                    <TransactionConflictGraphVis transactions={blockData.transactions} edges={blockData.edges} setSelectedTransaction={setSelectedTransaction} setSelectedEdge={setSelectedEdge}/>
                    <TransactionDialog isOpen={selectedTransaction!==null} transaction={getSelectedTransaction()} setIsOpen={setSelectedTransaction}/>
                    <EdgeDialog isOpen={selectedEdge!==null} edge={getSelectedEdge()} setIsOpen={setSelectedEdge}/>
                </div>
            }
            <div className='h-12'/>
        </PageLayout>
    );
}

export default VisualizePage;