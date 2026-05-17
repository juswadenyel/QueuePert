const ServingHighlight = ({ currentServing }) => (
  <div className="serving-highlight">
    <div className="serving-label">NOW SERVING</div>
    <div className="serving-big">
      {typeof currentServing === "object"
        ? currentServing?.priorityNumber  // CHANGED: was currentServing?.id, tickets have no .id field
        : currentServing || "--"}
    </div>
  </div>
);

export default ServingHighlight;