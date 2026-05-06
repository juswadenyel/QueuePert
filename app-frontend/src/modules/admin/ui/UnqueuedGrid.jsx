import React from "react";

const UnqueuedGrid = ({ queueList }) => (
  <div className="panel unqueued-panel">
    <h3 className="panel-header">UNQUEUED NO:</h3>
    <div className="unqueued-grid">
      {queueList && queueList.length > 0 
        ? queueList.map((item, i) => (
            <div key={i} className="grid-item" style={{ fontSize: '22px', fontWeight: 'bold' }}>
              {item.id}
            </div>
          ))
        : Array(21).fill("").map((_, i) => (
            <div key={i} className="grid-item dash" style={{ opacity: 0.5 }}>-</div>
          ))
      }
    </div>
  </div>
);

export default UnqueuedGrid;