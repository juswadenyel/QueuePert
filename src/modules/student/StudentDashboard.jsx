import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import Navbar from "../../components/Navbar";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <Navbar role="student" />

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

        <button className="action-btn" onClick={() => navigate("/student/login")}>Logout</button>
      </div>
    </div>
  );
}

export default StudentDashboard;