import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../assets/styles.css";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(data);
  };

  loadData();

  window.addEventListener("storage", loadData);

  return () => window.removeEventListener("storage", loadData);
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
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Transaction</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t, index) => (
                  <tr key={index}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.transaction}</td>
                    <td>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </div>
    </div>
  );
}

export default TransactionHistory;