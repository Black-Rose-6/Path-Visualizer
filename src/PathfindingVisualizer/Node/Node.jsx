import React from 'react';

import './Node.css';

const Node = (props) => {
  const { col, isFinish, isStart, isWall, onMouseClick, row,} = props;
  const extraClassName = isFinish ? 'node-finish': ( isStart ? 'node-start': (isWall? 'node-wall': ''));

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onClick={ ()=> onMouseClick(row ,col) }
      ></div>
  );
}

export default Node;
