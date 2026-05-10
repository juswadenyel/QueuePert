import React from "react";

const AdminPanel = ({ target, setTarget, counters, onAdd, onAddToCounter, onNext, onNoShow }) => {
  return (
    <div className="panel admin-panel">
      <h3 className="panel-header">ADMIN PANEL</h3>
      
      <button className="action-btn" onClick={onAdd}>Add Queue</button>
      <button className="action-btn" onClick={onAddToCounter}>Add To Counter</button>

      <div className="target-box" style={{ margin: '15px 0' }}>
        <span>Target:</span>
        <select value={target} onChange={(e) => setTarget(parseInt(e.target.value))}>
          {counters.map((_, i) => (
            <option key={i} value={i}>Counter {i + 1}</option>
          ))}
        </select>
      </div>

      <button className="action-btn" onClick={onNext}>Next Queue</button>
      
      <button className="action-btn no-show-btn" onClick={onNoShow}>
        Mark No Show
      </button>
    </div>
  );
};

export default AdminPanel;