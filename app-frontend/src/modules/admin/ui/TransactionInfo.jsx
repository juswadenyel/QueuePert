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

  const handleClose = () => {
    setEditingStudent(null);
  };

  const handleSave = () => {
    updateStudent(target, editingStudent.id, tempData); 
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
            <div key={student.id || index} className="info-details">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>#{index + 1} - {student.id}</strong>
                <button onClick={() => handleOpenEdit(student)} className="edit-btn">
                  EDIT
                </button>
              </div>
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>ID:</strong> {student.studentId || "N/A"}</p>
              <p><strong>Transaction:</strong> {student.transaction}</p>
            </div>
          ))
        ) : (
          <p className="no-student-placeholder">(no students at this counter)</p>
        )}
      </div>

      {/* --- EDIT MODAL CONTAINER --- */}
      {editingStudent && (
        <div className="edit-overlay">
          <div className="edit-modal-container">
            <h3>Edit Student Information</h3>
            <p style={{ color: '#7A1E2C', fontWeight: 'bold' }}>Queue ID: {editingStudent.id}</p>
            
            <div className="edit-form-group">
              <label>Full Name</label>
              <input name="name" value={tempData.name} onChange={handleChange} />
              
              <label>Student ID</label>
              <input name="studentId" value={tempData.studentId} onChange={handleChange} />
              
              <label>Transaction Type</label>
              <input name="transaction" value={tempData.transaction} onChange={handleChange} />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleClose}>CANCEL</button>
              <button className="save-btn" onClick={handleSave}>SAVE CHANGES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionInfo;