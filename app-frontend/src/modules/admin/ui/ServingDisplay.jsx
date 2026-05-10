import React from "react";

const ServingDisplay = ({ target, counters }) => {
  return (
    <div className="panel serving-panel" style={{ flex: 1 }}>
      <h3 className="serving-title" style={{ fontSize: '24px', marginBottom: '20px' }}>Now Serving</h3>
      <div className="counter-list" style={{ width: '100%', gap: '0' }}>
        {counters.map((arr, i) => (
          <div 
            key={i} 
            className={`counter-row ${target === i ? "active-target" : ""}`}
            style={{ 
              padding: '12px 0', 
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Counter {i + 1}: {arr.length > 0 ? arr.map(s => s.id).join(", ") : "Empty"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServingDisplay;