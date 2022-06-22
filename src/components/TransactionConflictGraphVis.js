import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types'; 
import Graph from "react-graph-vis";
  
  
const TransactionConflictGraphVis = (props) => {
  const [graph, setGraph] = useState(
    {
      nodes: parseTransactionsToNodes(props.transactions),
      edges: editEdges(props.edges),
    },
  );
  const [events, setEvents] = useState(
    {
      deselectNode: () => {
        props.setSelectedTransaction(null);
      },
      deselectEdge: () => {
        props.setSelectedEdge(null);
      },
      click: ({nodes, edges}) => {
        if(nodes.length !== 0) {
          props.setSelectedTransaction(nodes[0]);
        }
        if(nodes.length === 0 && edges.length !== 0) {
          props.setSelectedEdge(edges[0]);
        }
      },
      doubleClick: onDoubleClick
    },
  );

  const [firstAnimation, setFirstAnimation] = useState(true);
  const [scaleLevels, setScaleLevels] = useState([]);
  const [scaleIndex, setScaleIndex] = useState(null);

  const graphRef = useRef(null);

  // Color blocks in different colors
  const blockColors = [
    '#d4eeee', // Fabric light blue
    '#fbbbb7', // Fabric light
    '#ffffff', // white
    '#e5e7eb', // Gray-200, see divider color
    '#89c8ff', // TUM light
  ];

  useEffect(() => {
    if(firstAnimation) {
      const initScale = graphRef.current.Network.getScale();
      console.log('initial scale', initScale);

      if(initScale === 1) {
        setScaleLevels([1]);
      }
      else if (1 - initScale >= 0.5) {
        const secondScaleLevel = initScale + ((1 - initScale) / 2)
        setScaleLevels([initScale, secondScaleLevel, 1]);
        setScaleIndex(1);
      }
      else {
        setScaleLevels([initScale, 1]);
        setScaleIndex(1);
      }

      setFirstAnimation(false);
    }
  }, [firstAnimation])

  
  // Parse transactions from received input to nodes
  const parseTransactionsToNodes = ((transactions) => {
    console.log('parse transactions called');
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

  const onDoubleClick = useCallback((nodes, edges, pointer) => {
    console.log('scale levels', scaleLevels);
    if(nodes.length === 0 && edges.length === 0 && scaleLevels.length > 1) {
      console.log('conditions for moveTo fulfilled - pointer DOM x', pointer.DOM.x);
      graphRef.current.Network.moveTo({
        position: {x:pointer.DOM.x, y:pointer.DOM.y},
        scale: scaleLevels[scaleIndex],
        offset: {x:0, y:0},
        animation: {
          duration: 1000,
          easingFunction: "easeInOutQuad"
        }                 
      });
      if(scaleIndex === scaleLevels.length -1) {
        setScaleIndex(0);
      }
    }
  }, [scaleLevels]);


  // Method to add curve to bidirected straight edges
  const editEdges = ((edges) => {
    console.log('edit edges called');
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

  console.log('scale levels', scaleLevels);
  console.log('scale index', scaleIndex);

  return (
    <div>
      <div className='flex w-full justify-end'>
        {scaleLevels.length <= 1 ? <div/> : <p className='text-black-600'>Double click to zoom in and out</p>}
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
