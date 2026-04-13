import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PriorityForm({setQueueData}) {
  const navigate = useNavigate();

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

    const generatedQueue = "S-" + Math.floor(100 + Math.random() * 900);

    setQueueData({
      ...form,
      queueNumber: generatedQueue
    });

    navigate("/student/queue");
  };

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">QueuePert</div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/student/dashboard")}>Home</button>
          <button onClick={() => navigate("/student/queue")}>View Queue</button>
          <button onClick={() => {
            alert("Logged out");
            navigate("/student/login");
          }}>
            Logout</button>
        </div>
      </div>

      {/* FORM */}
      <div className="containerPriority">
        <h1>Priority Number Form</h1>
        <p className="description">Please fill in your details</p>

        <label className="input-label">ID Number:</label>
        <input
          type="text"
          name="id"
          placeholder="Enter ID Number"
          onChange={handleChange}
        />

        <label className="input-label">
          Full Name (Family Name, First Name, MI):
        </label>
        <input
          type="text"
          name="name"
          placeholder="e.g. Dela Cruz, Juan A."
          onChange={handleChange}
        />

        <label className="input-label">Year Level</label>
        <select name="year" onChange={handleChange}>
          <option>-- Choose an option --</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>

        <label className="input-label">Semester</label>
        <select name="semester" onChange={handleChange}>
          <option>-- Choose an option --</option>
          <option>First Term</option>
          <option>Second Term</option>
          <option>Mid Year Term</option>
        </select>

        <label className="input-label">Type of Transaction</label>
        <select name="transaction" onChange={handleChange}>
          <option>-- Choose an option --</option>
          <option>Tuition Payment</option>
          <option>Clearance</option>
          <option>Enrollment</option>
        </select>

        <button className="action-btn" onClick={handleSubmit}>
          Generate
        </button>
      </div>
    </div>
  );
}

export default PriorityForm;