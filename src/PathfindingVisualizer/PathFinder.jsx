import React, {useState ,useEffect} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

//Green Node // starting
const START_NODE_ROW = 0;
const START_NODE_COL = 0;

//Red Node // ending
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 14;

// grid is set to global state
// state is an object that stores the value of a component that could change over the time
// state is a volitile data that can be change overtime ====>> everytime the state changes the browser rerenders the browser
// this.setstate() is use to change the value of state object
//setstate() performs a shallow merge between the new and previous state
 
const PathFinder = () => {
  const [grid, setGrid] = useState([]);

  // initilising the grid ========>> basic 2d array initilisation 
  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 11; row++) {
      const currentRow = [];
      for (let col = 0; col < 15; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    console.log(grid);
    return grid;
  };
  
  // initilising node 
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
  
  // checking for the wall ====>> i.e. if the wall is present then reverting it and likewise
  const getNewGridWithWallToggled = (grid, row, col) => {
    // copying grid into newGrid
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    // created a new node
    const newNode = {
      // copied previous node
      ...node,
      // and changed its state of isWall to true
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
  
  // on starting the project useEffect starts and shows the grid 
  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);

  // fucntion for cliking on the cell i.e. wall toggle intermidiate passing step for gathering information
  function handleClick(row,col){
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 20 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 20 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 100 * i);
    }
  }

  function visualizeDijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    //Get relevant information
    // giving me the visited nodes in order to find the path (visualization: blue color)
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    // Giving me the shortest path
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    //Perform visual animation
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

    return (
      // wrapper
        <>
          <br /> <br />
          {/* button to start the visual outcome */}
          <button className='btn' onClick={() => visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          {/* .map is use as a foreach loop */}
          <div className="grid">
            {grid.map((row, i) => {
              return (
                <div key={i}>
                  {row.map((node, j) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={j}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        // mouse toggle function ====>> wall toggle =====>> handleClick will pick the row and coloumn pass it to 
                        // getnewgridwithwalltoggle and this function will toggle the wall and return the node
                        onMouseClick={()=>{handleClick(row,col)}} 
                        row={row}>
                        </Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      );
}

export default PathFinder;