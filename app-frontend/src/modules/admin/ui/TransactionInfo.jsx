import React, { useState } from "react";
import { useQueue } from "../../../context/QueueContext"; 

const TransactionInfo = ({ students, target }) => { 
  const { updateStudent } = useQueue(); 
  const [editingStudent, setEditingStudent] = useState(null);
  const [tempData, setTempData] = useState({});

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setTempData({ ...student });
  };

  const handleClose = () => setEditingStudent(null);

  const handleSave = () => {
    updateStudent(target, editingStudent.priorityNumber, tempData); 
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="panel transaction-info">
      <h3 className="panel-header">Transaction Information:</h3>
      <div className="transaction-list">
        {students && students.length > 0 ? (
          students.map((student, index) => (
            <div key={student.priorityNumber || index} className="info-details">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>#{index + 1} - {student.priorityNumber}</strong>
                <button onClick={() => handleOpenEdit(student)} className="edit-btn">EDIT</button>
              </div>
              <p><strong>Name:</strong> {student.fullName}</p>
              <p><strong>ID:</strong> {String(student.studentId)}</p>
              <p><strong>Course:</strong> {student.course}</p>
              <p><strong>Year Level:</strong> {student.yearLevel}</p>
              <p><strong>Semester:</strong> {student.semester}</p>
              <p><strong>Transaction:</strong> {student.transactionType}</p>
              <p><strong>Amount:</strong> ₱{student.amount}</p>
            </div>
          ))
        ) : (
          <p className="no-student-placeholder">(no students at this counter)</p>
        )}
      </div>

      {editingStudent && (
  <div className="edit-overlay">
    <div className="edit-modal-container">
      <h3>Edit Student Information</h3>

      <div className="edit-form-group">

        <label>Full Name</label>
        <input
          name="fullName"
          value={tempData.fullName || ""}
          onChange={handleChange}
        />

        <label>Student ID</label>
        <input
          name="studentId"
          value={String(tempData.studentId || "")}
          onChange={handleChange}
        />

        <label>Course</label>
        <input
          name="course"
          value={tempData.course || ""}
          onChange={handleChange}
        />

        <label>Year Level</label>
              <select name="yearLevel" value={tempData.yearLevel || ""} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>

        <label>Semester</label>
              <select name="semester" value={tempData.semester || ""} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Mid Year Term">Mid Year Term</option>
              </select>

        <label>Transaction Type</label>
              <select name="transactionType" value={tempData.transactionType || ""} onChange={handleChange}>
                <option value="">-- Select --</option>
                <option value="Tuition Payment">Tuition Payment</option>
                <option value="Clearance">Clearance</option>
                <option value="Enrollment">Enrollment</option>
              </select>

        <label>Amount</label>
        <input
          name="amount"
          value={tempData.amount || ""}
          onChange={handleChange}
        />

      </div>

      <div className="modal-actions">
        <button className="cancel-btn" onClick={handleClose}>
          CANCEL
        </button>
        <button className="save-btn" onClick={handleSave}>
          SAVE CHANGES
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default TransactionInfo;