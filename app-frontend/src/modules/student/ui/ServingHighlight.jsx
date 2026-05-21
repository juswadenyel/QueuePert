const ServingHighlight = ({ currentServing }) => (
  <div className="serving-highlight">
    <div className="serving-label">NOW SERVING</div>
    <div className="serving-big">
      {typeof currentServing === "object"
        ? currentServing?.priorityNumber 
        : currentServing || "--"}
    </div>
  </div>
);

export default ServingHighlight;