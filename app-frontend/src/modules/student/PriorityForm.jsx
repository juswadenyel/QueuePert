import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueue } from "../../context/QueueContext";
import PriorityFormCard from "./ui/PriorityFormCard";
import Navbar from "../../components/Navbar";


function PriorityForm() {
  const navigate = useNavigate();
  const { addQueue } = useQueue();

  const loggedInStudentRaw = localStorage.getItem("student");
  const loggedInStudent = loggedInStudentRaw
    ? JSON.parse(loggedInStudentRaw)
    : null;

  const [form, setForm] = useState({
    semester: "",
    transactionType: "",
    amount: ""
  });

  if (!loggedInStudent) {
    alert("No logged-in student found. Please login again.");
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.semester || !form.transactionType || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    const fullName =
      `${loggedInStudent.firstName} ` +
      `${loggedInStudent.middleInitial}. ` +
      `${loggedInStudent.lastName}`;

    addQueue({
      studentId: loggedInStudent.studentId,
      fullName,
      yearLevel: loggedInStudent.yearLevel,
      course: loggedInStudent.course,

      semester: form.semester,
      transactionType: form.transactionType,
      amount: form.amount
    });

    navigate("/student/queue");
  };

  return (
    <div className="login-page">
      <Navbar role="form" />

      <PriorityFormCard
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default PriorityForm;