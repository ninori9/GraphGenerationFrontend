import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types'; 
import Graph from "react-graph-vis";
  
  
const TransactionConflictGraphVis = (props) => {

  const [initialScale, setInitialScale] = useState(null);

  const [coordinates, setCoordinates] = useState([]);

  const graphRef = useRef(null);

  // Color blocks in different colors
  const blockColors = [
    '#d4eeee', // Fabric light blue
    '#fbbbb7', // Fabric light
    '#89c8ff', // TUM light
    '#ffffff', // white
    '#e5e7eb', // Gray-200, see divider color
  ];

  useEffect(() => {
    const initScale = graphRef.current.Network.getScale();
    console.log('INITIAL SCALE', initScale);
    setInitialScale(initScale);
  }, [initialScale]);


  useEffect(() => {
    console.log('inside coordinates useEffect');

    if(coordinates.length > 0 && initialScale !== 1) {
      const currentScale = graphRef.current.Network.getScale();
      
      const nextScale = currentScale === 1 ? initialScale 
        : (1 - currentScale >= 0.5 ? (currentScale + (1 - currentScale) / 2) : 1); 

      console.log('next scale', nextScale);

      graphRef.current.Network.moveTo({
        position: {x:coordinates[0], y:coordinates[1]},
        scale: nextScale,
        offset: {x:0, y:0},
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad"
        }
      });

    }
  }, [coordinates]);

  
  // Parse transactions from received input to nodes
  const parseTransactionsToNodes = ((transactions) => {
    let parsedTx = [];

    let blocks= [];

    for(let i = 0; i<transactions.length; i++) {
      // For testing puroposes: (TODO: Remove)
      if(transactions[i].tx_number === 324 || transactions[i].tx_number === 311 || transactions[i].tx_number === 302 || transactions[i].tx_number === 331 || transactions[i].tx_number === 300 || transactions[i].tx_number === 326 || transactions[i].tx_number === 328) {
        console.log(`RW SET for: Transaction ${transactions[i].tx_number}`, transactions[i].rw_set);
      }

      if(! blocks.includes(transactions[i].block_number)) {
        blocks.push(transactions[i].block_number);
      }

      parsedTx.push(
        {
          id: transactions[i].tx_number,
          label: `Tx ${transactions[i].tx_number}`,
          color: {
            // Border dark red (red-800) if transaction failed
            border: transactions[i].status === 0 ? '#000000' : '#991b1b',
            background: blockColors[blocks.indexOf(transactions[i].block_number) % 5],
          },
          borderWidth: transactions[i].status === 0 ? 2 : 4,
        }
      );
    }
    return parsedTx;
  });

  // Method to add curve to bidirected straight edges
  const editEdges = ((edges) => {
    let parsedEdges = [];

    for(let i=0; i<edges.length; i++) {
      // If edge already exists "the other way around", add curve
      if(edges.filter(edge => (edge.from === edges[i].to && edge.to === edges[i].from)).length > 0) {
        parsedEdges.push(
          {
            id: edges[i].edge_number,
            from: edges[i].from,
            to: edges[i].to,
            color: {
              color: edges[i].reason_for_failure? '#991b1b' : '#000000',
              highlight: '#0064BD',
            },
            width: edges[i].reason_for_failure? 3 : 2,
            smooth: {
              enabled: true,
              type: "curvedCW",
              roundness: 0.25
            }
          }
        );
      }
      else {
        parsedEdges.push(
          {
            id: edges[i].edge_number,
            from: edges[i].from,
            to: edges[i].to,
            color: {
              color: edges[i].reason_for_failure? '#991b1b' : '#000000',
              highlight: '#0064BD',
            },
            width: edges[i].reason_for_failure? 3 : 2,
          }
        );
      }
    }
    return parsedEdges;
  });
  

  // Height of graph (minimum 300 or 0 if no transactions; maxiumum 1280 (corresponds to max width)
  const h = `${(props.transactions.length * 32 > 400 || props.transactions.length === 0) ?
    (props.transactions.length * 32 > 1280 ? 1280: props.transactions.length * 32) : 400}px`;
  //console.log('Graph height', h);


  const options = {
    height: h,
    width: '100%',
    layout: {
      hierarchical: false
    },
    edges: {
      arrowStrikethrough: false
    },
    nodes: {
      font: {
        size: 14,
        color: '#000000'
      },
      labelHighlightBold: true,
      color: {
        highlight: {
          border: '#0064BD'
        },
      },
      shape: 'circle',
    },
    interaction: {
      navigationButtons: false,
    }
  };

  const [state, setState] = useState({
    counter: props.transactions.length,
    graph: {
      nodes: parseTransactionsToNodes(props.transactions),
      edges: editEdges(props.edges),
    },
    events: {
      deselectNode: ({ nodes, edges }) => {
        props.setSelectedTransaction(null);
      },
      deselectEdge: ({ nodes, edges }) => {
        props.setSelectedEdge(null);
      },
      click: ({ nodes, edges }) => {
        if(nodes.length !== 0) {
          props.setSelectedTransaction(nodes[0]);
        }
        if(nodes.length === 0 && edges.length !== 0) {
          props.setSelectedEdge(edges[0]);
        }
      },
      doubleClick: ({ nodes, edges, pointer}) => {
        if(nodes.length === 0 && edges.length === 0) {
          setCoordinates([pointer.canvas.x, pointer.canvas.y]);
        }
      }
    },
  });

  const { graph, events } = state;


  return (
    <div>
      <div className='flex w-full justify-end'>
        {initialScale === 1 ? <div/> : <p className='text-black-600'>Double click to zoom in and out</p>}
      </div>
      <div className='border-2 border-solid border-tum w-full h-fit'>
        <Graph ref={graphRef} graph={graph} options={options} events={events} />
      </div>
    </div>
  );
}


TransactionConflictGraphVis.propTypes = {
  transactions: PropTypes.array.isRequired,
  setSelectedTransaction: PropTypes.func.isRequired,
  edges: PropTypes.array.isRequired,
  setSelectedEdge: PropTypes.func.isRequired,
};

export default TransactionConflictGraphVis;
