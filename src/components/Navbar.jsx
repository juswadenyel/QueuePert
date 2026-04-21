import { useNavigate } from "react-router-dom";
import ProfileMenu from "../modules/student/ProfileMenu"; 
// adjust path if needed

function Navbar({ role, variant }) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">QueuePert</div>

      <div className="nav-buttons">

        {/* STUDENT NAV */}
        {role === "student" && (
          <>
            <button onClick={() => navigate("/student/queue")}>
              View Queue
            </button>

            <ProfileMenu showHistory={true}/>
          </>
        )}


        {/* ADMIN */}
        {role === "admin" && (
          <>
            <button onClick={() => alert("Daily Report Generated")}>
              View Daily Report
            </button>

            <button onClick={() => navigate("/admin/login")}>
              Logout
            </button>
          </>
        )}

        {/* STUDENT HISTORY PAGE */}
        {role === "transaction" && variant === "history" && (
          <>
            <button onClick={() => navigate("/student/dashboard")}>
              Home
            </button>

            <ProfileMenu showHistory={false} />
          </>
        )}

      </div>
    </div>
  );
}

export default Navbar;