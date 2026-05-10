const PriorityCard = ({ localTicket, onCancel }) => (
  <div className="queue-card priority-card">
    <p>Priority Number</p>

    <div className="priority-number">
      {localTicket || "--"}
    </div>

    <p className="priority-status">
      {localTicket?.status || ""}
    </p>

    <button
      className="cancel-queue-btn"
      onClick={() => {
        const confirmCancel = window.confirm(
          "Are you sure you want to cancel your transaction?"
        );
        if (confirmCancel) onCancel();
      }}
    >
      Cancel Transaction
    </button>
  </div>
);

export default PriorityCard;