import React from "react";

const StatBox = ({ label, value, unit = "" }) => (
  <div className="panel stat-box">
    {label}
    <div className="stat-val">{value} {unit}</div>
  </div>
);

export default StatBox;