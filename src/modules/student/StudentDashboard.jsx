import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">QueuePert</div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/student/queue")}>View Queue</button>
          <button onClick={() => {
            navigate("/student/login");
            alert("Logged out");
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="containerLogin">
        <h1>QueuePert</h1>
        <p className="description">University Queue Management System</p>

        <button className="action-btn" onClick={() => navigate("/student/form")}>
          Get Priority Number
        </button>

        <button
            className="action-btn secondary-btn"
            onClick={() => navigate("/student/queue")}
>
            View Queue Status
       </button>
      </div>
    </div>
  );
}

export default StudentDashboard;