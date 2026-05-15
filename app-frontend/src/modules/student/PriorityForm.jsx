import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PriorityFormCard from "./ui/PriorityFormCard";
import Navbar from "../../components/Navbar";
import { useQueue } from "../../context/QueueContext";

function PriorityForm() {
  const navigate = useNavigate();
  const { setLatestTicket } = useQueue();
  const loggedInStudentRaw = localStorage.getItem("student");
  const loggedInStudent = loggedInStudentRaw
    ? JSON.parse(loggedInStudentRaw)
    : null;

  const [form, setForm] = useState({
    semester:        "",
    transactionType: "",
    amount:          ""
  });

  if (!loggedInStudent) {
    alert("No logged-in student found. Please login again.");
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.semester || !form.transactionType || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/queue/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student:         { studentId: loggedInStudent.studentId },
          transactionType: form.transactionType,
          semester:        form.semester,
          amount:          parseFloat(form.amount),
        })
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Failed to request ticket");
        return;
      }

      const ticketData = await response.json();
      setLatestTicket(ticketData);
      navigate("/student/queue");
      
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server. Make sure the backend is running.");
    }
  };

  return (
    <div className="login-page">
      <Navbar role="form" />
      <PriorityFormCard
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default PriorityForm;