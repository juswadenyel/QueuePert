const CounterList = ({ counters }) => (
  <div className="queue-counter-list">
    {counters.map((arr, i) => (
      <div key={i} className="queue-counter-row">
        <span>Counter {i + 1}</span>
        <span>
          {arr.length ? arr.map(item => item.priorityNumber).join(", ") : "--"}
        </span>
      </div>
    ))}
  </div>
);

export default CounterList;