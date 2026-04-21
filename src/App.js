import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// ✅ IMPORT ONLY ONCE
import { QueueProvider } from "./context/QueueContext";

import Login from './modules/auth/Login';
import Admin from "./modules/auth/Admin";
import StudentDashboard from "./modules/student/StudentDashboard";
import PriorityForm from "./modules/student/PriorityForm";
import QueueStatus from './modules/student/QueueStatus';
import Dashboard from './modules/admin/Dashboard';
import TransactionHistory from "./modules/student/TransactionHistory";

function App() {
  const [queueData, setQueueData] = useState(null);

  return (
    <QueueProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/student/login" />} />
          <Route path="/student/login" element={<Login />} />
          <Route path="/admin/login" element={<Admin />} />   
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route 
            path="/student/form" 
            element={<PriorityForm setQueueData={setQueueData} />} 
          />
          <Route 
            path="/student/queue" 
            element={<QueueStatus queueData={queueData} />} 
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/student/history" element={<TransactionHistory />} />
        </Routes>
      </BrowserRouter>
    </QueueProvider>
  );
}

export default App;