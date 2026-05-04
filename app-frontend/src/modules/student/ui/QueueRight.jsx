import ServingHighlight from "./ServingHighlight";
import CounterList from "./CounterList";

const QueueRight = ({ currentServing, counters }) => (
  <div className="queue-right-panel">
    <ServingHighlight currentServing={currentServing} />
    <CounterList counters={counters} />
  </div>
);

export default QueueRight;