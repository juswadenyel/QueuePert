const DashboardCard = ({ onGetNumber, onViewQueue }) => (
  <div className="containerLogin">
    <h1>QueuePert</h1>
    <p className="description">University Queue Management System</p>

    <button className="action-btn" onClick={onGetNumber}>
      Get Priority Number
    </button>

    <button className="action-btn secondary-btn" onClick={onViewQueue}>
      View Queue Status
    </button>
  </div>
);

export default DashboardCard;