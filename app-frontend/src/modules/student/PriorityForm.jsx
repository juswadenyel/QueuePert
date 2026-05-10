import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueue } from "../../context/QueueContext";
import PriorityFormCard from "./ui/PriorityFormCard";
import Navbar from "../../components/Navbar";

function PriorityForm() {
  const navigate = useNavigate();
  const { addQueue } = useQueue();

  const [form, setForm] = useState({
    semester: "",
    transactionType: "",
    amount: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.semester || !form.transactionType || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    const newTransaction = addQueue({
      semester: form.semester,
      transactionType: form.transactionType,
      amount: form.amount
    });

    console.log("SENT TO QUEUE:", newTransaction);

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