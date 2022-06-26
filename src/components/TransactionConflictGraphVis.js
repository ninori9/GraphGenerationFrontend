import React, {useState, useMemo, useRef, useEffect} from 'react';
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


  // If transactions or edges could not be parsed correctly, lift error state up to parent component (page)
  useEffect(() => {
    if((parseTransactionsToNodes === false || editEdges === false) && props.setError !== undefined && props.setError !== null) {
      props.setError('Error: Strucure check failed - could not parse the provided transactions and edges.');
    }
    else if(props.setRenderHeader !== undefined && props.setRenderHeader !== null) {
      props.setRenderHeader(true);
    }
  }, [])


  // Use effect to determine the initial scale of the graph
  useEffect(() => {
    if(graphRef !== null && graphRef.current !== undefined && graphRef.current !== null) {
      const initScale = graphRef.current.Network.getScale();
      setInitialScale(initScale);
    }
  }, [initialScale]);


  // Use effect triggered by double clicking on graph (sets coordinates state) --> determine next scale to anmiate to and animate to it
  useEffect(() => {

    if(coordinates.length > 0 && initialScale !== 1) {
      const currentScale = graphRef.current.Network.getScale();
      
      const nextScale = currentScale === 1 ? initialScale 
        : (1 - currentScale >= 0.5 ? (currentScale + (1 - currentScale) / 2) : 1); 


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

  
  // Parse transactions from received input to nodes, see https://visjs.github.io/vis-network/docs/network/nodes.html
  const parseTransactionsToNodes = useMemo(() => {
    let parsedTx = [];

    let blocks= [];

    for(let i = 0; i<props.transactions.length; i++) {
      // Structure validation (checking all accessed attributes) --> required for uploaded json files 
      if(props.transactions[i].block_number === undefined || isNaN(props.transactions[i].block_number) || props.transactions[i].tx_number === undefined || 
        isNaN(props.transactions[i].tx_number) || props.transactions[i].status === undefined || isNaN(props.transactions[i].status)) {
        
        return false;
      }

      if(! blocks.includes(props.transactions[i].block_number)) {
        blocks.push(props.transactions[i].block_number);
      }

      parsedTx.push(
        {
          id: props.transactions[i].tx_number,
          label: `Tx ${props.transactions[i].tx_number}`,
          color: {
            // Border dark red (red-800) if transaction failed
            border: props.transactions[i].status === 0 ? '#000000' : '#991b1b',
            background: blockColors[blocks.indexOf(props.transactions[i].block_number) % 5],
          },
          borderWidth: props.transactions[i].status === 0 ? 2 : 4,
        }
      );
    }
    return parsedTx;
  }, [props.transactions]);


  // Parse and validate edges, add curve to bidirected straight edge, see https://visjs.github.io/vis-network/docs/network/edges.html
  const editEdges = useMemo(() => {
    let parsedEdges = [];

    for(let i=0; i<props.edges.length; i++) {
      // Structure check, required for uploaded json files
      if(props.edges[i].from === undefined || isNaN(props.edges[i].from) || props.edges[i].to === undefined || isNaN(props.edges[i].to) || 
        props.edges[i].edge_number === undefined || props.edges[i].reason_for_failure === undefined) {
        return false;
      }

      // If edge already exists "the other way around", add curve
      if(props.edges.filter(edge => (edge.from === props.edges[i].to && edge.to === props.edges[i].from)).length > 0) {
        parsedEdges.push(
          {
            id: props.edges[i].edge_number,
            from: props.edges[i].from,
            to: props.edges[i].to,
            color: {
              color: props.edges[i].reason_for_failure? '#991b1b' : '#000000',
              highlight: '#0064BD',
            },
            width: props.edges[i].reason_for_failure? 3 : 2,
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
            id: props.edges[i].edge_number,
            from: props.edges[i].from,
            to: props.edges[i].to,
            color: {
              color: props.edges[i].reason_for_failure? '#991b1b' : '#000000',
              highlight: '#0064BD',
            },
            width: props.edges[i].reason_for_failure? 3 : 2,
          }
        );
      }
    }
    return parsedEdges;
  }, [props.edges]);
  

  // Height of graph (24px per additional tx, minimum 400 or 0 if no transactions; maxiumum 1280 (corresponds to max width)
  const h = `${(props.transactions.length * 24 > 400 || props.transactions.length === 0) ?
    (props.transactions.length * 24 > 1280 ? 1280: props.transactions.length * 24) : 400}px`;


  // Graph options, see https://visjs.github.io/vis-network/docs/network/#options
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
  };


  const [state, setState] = useState({
    counter: props.transactions.length,
    graph: {
      nodes: parseTransactionsToNodes,
      edges: editEdges,
    },
    events: {
      deselectNode: () => {
        props.setSelectedTransaction(null);
      },
      deselectEdge: () => {
        props.setSelectedEdge(null);
      },
      click: ({ nodes, edges }) => {
        // Clicking on a node or edge should open the corresponding dialog
        if(nodes.length !== 0) {
          props.setSelectedTransaction(nodes[0]);
        }
        if(nodes.length === 0 && edges.length !== 0) {
          props.setSelectedEdge(edges[0]);
        }
      },
      doubleClick: ({ nodes, edges, pointer}) => {
        // Zoom on double click (by setting coordinates state, zooming done in corresponding useEffect)
        if(nodes.length === 0 && edges.length === 0) {
          setCoordinates([pointer.canvas.x, pointer.canvas.y]);
        }
      }
    },
  });

  const { graph, events } = state;


  // If transactions could not be parsed, return empty div
  if(parseTransactionsToNodes === false || editEdges === false) {
    return <div/>;
  }
  // Else return graph
  else {
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
}


TransactionConflictGraphVis.propTypes = {
  transactions: PropTypes.array.isRequired,
  setSelectedTransaction: PropTypes.func.isRequired,
  edges: PropTypes.array.isRequired,
  setSelectedEdge: PropTypes.func.isRequired,
};

export default TransactionConflictGraphVis;
