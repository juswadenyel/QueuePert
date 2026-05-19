import { useNavigate } from "react-router-dom";
import ProfileMenu from "../modules/student/ProfileMenu"; 
// adjust path if needed

function Navbar({ role, variant,onDailyReport }) {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">QueuePert</div>

      <div className="nav-buttons">

        {/* STUDENT NAV */}
        {role === "student" && (
          <>
            <ProfileMenu showHistory={true}/>
          </>
        )}

        {/* VIEW QUEUE NAV */}
        {role === "queue" && (
          <>
            <button onClick={() => navigate("/student/dashboard")}>
              Home
            </button>

            <ProfileMenu showHistory={true}/>
          </>
        )}

        {/* PRIORITY FORM NAV */}
        {role === "form" && (
          <>
            <button onClick={() => navigate("/student/dashboard")}>
              Home
            </button>

            <ProfileMenu showHistory={true}/>
          </>
        )}


        {/* ADMIN */}
        {role === "admin" && (
          <>
            <button onClick={onDailyReport}>
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