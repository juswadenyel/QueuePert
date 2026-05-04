import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import DashboardCard from "./ui/DashboardCard";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="login-page">

      <Navbar role="student" />

      <DashboardCard
        onGetNumber={() => navigate("/student/form")}
        onViewQueue={() => navigate("/student/queue")}
      />

    </div>
  );
}

export default StudentDashboard;