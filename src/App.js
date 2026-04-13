import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from './modules/auth/Login';
import Admin from "./modules/auth/Admin";
import StudentDashboard from "./modules/student/StudentDashboard";
import PriorityForm from "./modules/student/PriorityForm";
import QueueStatus from './modules/student/QueueStatus';
import Dashboard from './modules/admin/Dashboard';

function App() {
  const [page, setPage] = useState("login");
  const [queueData, setQueueData] = useState(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student/login" element={<Login />} />
          <Route path="/admin/login" element={<Admin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/form" element={<PriorityForm setQueueData={setQueueData} />} />
          <Route path="/student/queue" element={<QueueStatus queueData={queueData} />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
