// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (unvisitedNodes.length) {
    // sorts the node according to the distance from source node 
    sortNodesByDistance(unvisitedNodes);
    // .shift ====>> removes the first element in the array and return the removed element
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) 
      continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop ====>> path not possible.
    if (closestNode.distance === Infinity) 
      return visitedNodesInOrder;
    // if we are able to traverse
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    // if we have reached end node then return the path
    if (closestNode === finishNode) 
      return visitedNodesInOrder;
    // if we havent reached then 
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

// sorts the node according to distance from previous node
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// updated distance of neighbour node as +1, and update neighbour's node prev node as current node
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

// giving me all the unvisited neighbours
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  
  if (row > 0) 
    neighbors.push(grid[row - 1][col]);
  
  if (row < grid.length - 1) 
    neighbors.push(grid[row + 1][col]);
  
  if (col > 0) 
    neighbors.push(grid[row][col - 1]);
  
  if (col < grid[0].length - 1) 
    neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// storing all nodes in an array
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
