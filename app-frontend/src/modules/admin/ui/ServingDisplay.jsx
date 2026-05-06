import React from "react";

const ServingDisplay = ({ target, counters }) => {
  return (
    <div className="center-column">
      <div className="panel your-queue">
        <h3 className="panel-header">YOUR QUEUE (Counter {target + 1}):</h3>
        <div className="serving-number">
          {counters[target]?.length > 0
            ? counters[target].map(item => item.id).join(", ")
            : "--"}
        </div>
      </div>

      <div className="panel serving-panel">
        <h2 className="serving-title">Now Serving</h2>
        <div className="serving-container">
          <div className="counter-list">
            {counters.map((arr, i) => (
              <div 
                key={i} 
                className={`counter-row ${target === i ? "active-target" : ""}`}
              >
                Counter {i + 1}: {arr?.length > 0 
                  ? arr.map(item => item.id).join(", ") 
                  : "Empty"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServingDisplay;