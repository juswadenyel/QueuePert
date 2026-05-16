import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // REMOVED: const data = JSON.parse(localStorage.getItem("transactions")) || [];
    // REMOVED: was reading from localStorage which was never written to, always empty
    // REMOVED: window.addEventListener("storage", loadData) — no longer needed

    // ADDED: get logged-in student's ID from localStorage
    const student = JSON.parse(localStorage.getItem("student") || "{}");
    const studentId = student.studentId;

    // ADDED: guard — if no student logged in, don't fetch
    if (!studentId) return;

    // ADDED: fetch all tickets for this student from the backend API
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

        <div className="panel" style={{ width: "800px" }}>
          <h2 className="panel-header">Transaction History</h2>

          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    {/* CHANGED: updated column headers to match actual ticket fields from DB */}
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
                      {/* CHANGED: updated fields from t.id/t.name/t.transaction/t.date
                          to actual API response fields */}
                      <td>{t.priorityNumber}</td>
                      <td>{t.transactionType}</td>
                      <td>{t.semester}</td>
                      <td>₱{t.amount}</td>
                      <td>{t.status}</td>
                      {/* ADDED: format timeCreated date properly */}
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