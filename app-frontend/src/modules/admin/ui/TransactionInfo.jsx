import React, { useState, useRef, useEffect } from "react";
import { useQueue } from "../../../context/QueueContext";

const TransactionInfo = ({ students, target }) => {
  const { updateStudent, reorderCounter } = useQueue();
  const [editingStudent, setEditingStudent] = useState(null);
  const [tempData, setTempData] = useState({});

  const [orderedStudents, setOrderedStudents] = useState(students || []);
  const dragItem     = useRef(null);
  const dragOverItem = useRef(null);
  const isDirty      = useRef(false);
  // ADDED: ref to always hold the latest ordered list
  // needed because React state is async — handleDragEnd reads stale orderedStudents without this
  const orderedRef   = useRef(students || []);

  useEffect(() => {
    if (!isDirty.current) {
      setOrderedStudents(students || []);
      orderedRef.current = students || []; // ADDED: keep ref in sync with poll reset
    } else {
      const prevIds = orderedStudents.map(s => s.queueId).sort().join(",");
      const newIds  = (students || []).map(s => s.queueId).sort().join(",");
      if (prevIds !== newIds) {
        setOrderedStudents(students || []);
        orderedRef.current = students || []; // ADDED: keep ref in sync on force reset
        isDirty.current = false;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    if (dragItem.current === null || dragItem.current === index) return;
    const newList = [...orderedStudents];
    const dragged = newList.splice(dragItem.current, 1)[0];
    newList.splice(index, 0, dragged);
    dragItem.current = index;
    setOrderedStudents(newList);
    // ADDED: keep ref in sync so handleDragEnd always reads the latest order
    orderedRef.current = newList;
  };

  // CHANGED: uses orderedRef.current instead of orderedStudents
  // orderedStudents is stale in handleDragEnd due to React async state
  // orderedRef always holds the latest dragged order
  const handleDragEnd = () => {
    isDirty.current      = true;
    dragItem.current     = null;
    dragOverItem.current = null;
    // CHANGED: was reorderCounter(target, orderedStudents) — stale state
    // now uses orderedRef.current which is always up to date
    reorderCounter(target, orderedRef.current);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setTempData({ ...student });
  };

  const handleClose = () => setEditingStudent(null);

  const handleSave = () => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    fetch(`http://localhost:8080/queue/${editingStudent.queueId}/details`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Id": admin.adminId,
      },
      body: JSON.stringify({
        transactionType: tempData.transactionType,
        semester:        tempData.semester,
        amount:          tempData.amount,
      }),
    })
      .then(res => res.json())
      .then(() => {
        updateStudent(target, editingStudent.priorityNumber, tempData);
        handleClose();
      })
      .catch(err => {
        console.error("Failed to save changes:", err);
        alert("Failed to save changes. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="panel transaction-info">
      <h3 className="panel-header">Transaction Information:</h3>

      {orderedStudents.length > 1 && (
        <p style={{ fontSize: "11px", opacity: 0.6, textAlign: "center", marginBottom: "8px" }}>
          ☰ Drag cards to reorder serving priority
        </p>
      )}

      <div className="transaction-list" style={{
        overflowY: "auto",
        flex: 1,
        paddingRight: "6px",
      }}>
        {orderedStudents.length > 0 ? (
          orderedStudents.map((student, index) => (
            <div
              key={student.priorityNumber || index}
              className="info-details"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              style={{
                cursor: "grab",
                borderLeft: index === 0
                  ? "5px solid #7A1E2C"
                  : "5px solid rgba(0,0,0,0.08)",
                transition: "border 0.2s, transform 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
              onMouseLeave={e => e.currentTarget.style.transform  = "scale(1)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ opacity: 0.4, fontSize: "16px", cursor: "grab" }}>⠿</span>
                  <strong>
                    {index === 0 && (
                      <span style={{
                        background: "#7A1E2C", color: "white",
                        fontSize: "10px", fontWeight: "bold",
                        padding: "2px 6px", borderRadius: "4px",
                        marginRight: "6px",
                      }}>
                        NEXT
                      </span>
                    )}
                    #{index + 1} - {student.priorityNumber}
                  </strong>
                </div>
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
                type="number"
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