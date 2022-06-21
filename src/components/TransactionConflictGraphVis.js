import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types'; 
import Graph from "react-graph-vis";
  
  
const TransactionConflictGraphVis = (props) => {
  const graphRef = useRef(null);

  // Color blocks in different colors
  const blockColors = [
    '#d4eeee', // Fabric light blue
    '#fbbbb7', // Fabric light
    '#ffffff', // white
    '#e5e7eb', // Gray-200, see divider color
    '#89c8ff', // TUM light
  ];

  
  // Parse transactions from received input to nodes
  const parseTransactionsToNodes = ((transactions) => {
    let parsedTx = [];

    let blocks= [];

    for(let i = 0; i<transactions.length; i++) {
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
  console.log('Graph height', h);


  const options = {
    height: h,
    width: '100%',
    clickToUse: false,
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
      deselectEdge: ({ nodes, edges}) => {
        props.setSelectedEdge(null);
      },
      click: ({nodes, edges}) => {
        if(nodes.length !== 0) {
          props.setSelectedTransaction(nodes[0]);
        }
        if(nodes.length === 0 && edges.length !== 0) {
          props.setSelectedEdge(edges[0]);
        }
        console.log(graphRef.current);
        console.log(graphRef.current.$el);
        graphRef.current.$el.moveTo({
          position: {x:0, y:0},    // position to animate to
          scale: 1.5,              // scale to animate to
          offset: {x:0, y:0},      // offset from the center in DOM pixels (Numbers)
          animation: {             // animation object, can also be Boolean
            duration: 1000,                 // animation duration in milliseconds (Number)
            easingFunction: "easeInOutQuad" // Animation easing function, available are:
          }                 
        });
      }
    }
  })

  const { graph, events } = state;


  return (
    <div className='border-2 border-solid border-tum w-full h-fit'>
      <Graph ref={graphRef} graph={graph} options={options} events={events} />
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