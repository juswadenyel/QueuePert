import { useNavigate } from "react-router-dom";

function QueueStatus({ queueData }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">QueuePert</div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/student/dashboard")}>Home</button>
          <button onClick={() => {
            navigate("/student/login");
            alert("Logged out");
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-wrapper">
        <div className="main-row">
          <div className="panel">
            <h3>YOUR QUEUE:</h3>
            <h2>{queueData?.queueNumber || "--"}</h2>
            <button className="action-btn">Cancel Queue</button>
          </div>

          <div className="panel">
            <h3>NOW SERVING</h3>
            <div className="serving-number">S-312</div>
            <p>Counter 3 (Registrar)</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <p>NEXT IN LINE</p>
            <strong>S-313</strong>
          </div>

          <div className="stat-box">
            <p>WAITING</p>
            <strong>18</strong>
          </div>

          <div className="stat-box">
            <p>AVG WAIT</p>
            <strong>14 min</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueStatus;