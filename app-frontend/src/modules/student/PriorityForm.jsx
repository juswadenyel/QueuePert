import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueue } from "../../context/QueueContext";
import PriorityFormCard from "./ui/PriorityFormCard";
import Navbar from "../../components/Navbar";

function PriorityForm({ setQueueData }) {
  const navigate = useNavigate();
  const { addQueue } = useQueue();

  const [form, setForm] = useState({
    id: "",
    name: "",
    year: "",
    semester: "",
    transaction: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
  if (!form.id || !form.name) {
    alert("Please fill all required fields");
    return;
  }

  const newTransaction = addQueue({
    studentId: form.id,   // ✅ IMPORTANT FIX
    name: form.name,      // ✅ MUST match QueueContext
    year: form.year,
    semester: form.semester,
    transaction: form.transaction
  });

  console.log("SENT TO QUEUE:", newTransaction);

  navigate("/student/queue");
};


  return (
    <div className="login-page">

      <Navbar role="student" />

      <PriorityFormCard
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

    </div>
  );
}

export default PriorityForm;