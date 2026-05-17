import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // REMOVED: localStorage read — was never written to, always empty
    // ADDED: fetch from backend API using logged-in student's ID
    const student = JSON.parse(localStorage.getItem("student") || "{}");
    const studentId = student.studentId;

    if (!studentId) return;

    fetch(`http://localhost:8080/queue/student/${studentId}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Failed to load transactions:", err));
  }, []);

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <Navbar role="transaction" variant="history" />

      {/* CONTENT */}
      <div className="dashboard-wrapper">

        {/* CHANGED: fixed width="800px" → fluid width 90% with maxWidth for web responsiveness */}
        <div className="panel" style={{ width: "90%", maxWidth: "800px" }}>
          <h2 className="panel-header">Transaction History</h2>

          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Priority No.</th>
                    <th>Transaction</th>
                    <th>Semester</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={index}>
                      <td>{t.priorityNumber}</td>
                      <td>{t.transactionType}</td>
                      <td>{t.semester}</td>
                      <td>₱{t.amount}</td>
                      <td>{t.status}</td>
                      <td>{t.timeCreated ? new Date(t.timeCreated).toLocaleDateString() : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default TransactionHistory;