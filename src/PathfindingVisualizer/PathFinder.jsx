import React, {useState ,useEffect} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

//Green Node
const START_NODE_ROW = 5;
const START_NODE_COL = 5;

//Red Node
const FINISH_NODE_ROW = 5;
const FINISH_NODE_COL = 10;


const PathFinder = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

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
  
  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
  
  
  useEffect(() => {
    const grid = getInitialGrid();
    setGrid(grid);
  }, []);

  
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
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    //Perform visual animation
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
    return (
        <>
          <br /> <br />
          <button className='btn' onClick={() => visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
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
                        mouseIsPressed={mouseIsPressed}
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