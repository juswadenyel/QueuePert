import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from './modules/auth/Login';
import Admin from "./modules/auth/Admin";
import StudentDashboard from "./modules/student/StudentDashboard";
import PriorityForm from "./modules/student/PriorityForm";
import QueueStatus from './modules/student/QueueStatus';

function App() {
  const [page, setPage] = useState("login");
  const [queueData, setQueueData] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/form" element={<PriorityForm setQueueData={setQueueData} />} />
        <Route path="/queue" element={<QueueStatus queueData={queueData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
