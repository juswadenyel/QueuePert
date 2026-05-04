import PriorityCard from "./PriorityCard";
import InfoCard from "./InfoCard";

const QueueLeft = ({
  localTicket,
  onCancel,
  nextInLine,
  waitingCount,
  averageWaitTime
}) => (
  <div className="queue-left">
    <PriorityCard localTicket={localTicket} onCancel={onCancel} />
    <InfoCard label="Next in line" value={nextInLine} />
    <InfoCard label="Waiting" value={waitingCount} />
    <InfoCard label="Avg waiting time" value={`${averageWaitTime} min`} />
  </div>
);

export default QueueLeft;