import React from "react";

const AdminPanel = ({ target, setTarget, counters, onAdd, onAddToCounter, onNext, onDelete }) => {
  return (
    <div className="panel admin-panel">
      <h3 className="panel-header">ADMIN PANEL</h3>
      
      <button className="action-btn" onClick={onAdd}>
        Add Queue
      </button>

      <button className="action-btn" onClick={() => onAddToCounter(target)}>
        Add To Counter
      </button>
      
      <div className="target-box" style={{ background: '#7A1E2C', color: 'white', padding: '10px', borderRadius: '8px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Target:</span>
        <select value={target} onChange={(e) => setTarget(parseInt(e.target.value))} style={{ width: 'auto', margin: 0 }}>
          {counters.map((_, i) => (
            <option key={i} value={i}>Counter {i + 1}</option>
          ))}
        </select>
      </div>

      <button className="action-btn" onClick={() => onNext(target)}>
        Next Queue
      </button>
      
      <button className="action-btn" onClick={onDelete}>
        Delete Queue
      </button>
      
      <button className="action-btn">
        Set Queue Limit
      </button>
    </div>
  );
};

export default AdminPanel;