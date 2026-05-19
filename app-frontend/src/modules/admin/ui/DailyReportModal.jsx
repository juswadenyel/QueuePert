import React, { useEffect, useState } from "react";
import "../../../assets/styles.css";

const DailyReportModal = ({ open, onClose }) => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (!open) return;

        const admin = JSON.parse(localStorage.getItem("admin") || "{}");

        if (!admin?.adminId) {
            console.error("Missing adminId");
            return;
        }

        fetch("http://localhost:8080/queue/report/daily", {
            headers: {
                "X-Admin-Id": admin.adminId
            }
        })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }
            return res.json();
        })
        .then(data => setReport(data))
        .catch(err => {
            console.error("REPORT ERROR:", err);
            setReport({ tickets: [] }); // prevents infinite loading
        });

    }, [open]);

    if (!open) return null;

    return (
        <div className="report-overlay">
            <div className="report-modal">

                <div className="report-header">
                    <h2>Daily Transaction Report</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {!report ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="report-summary">
                            <p><strong>Admin:</strong> {report.adminName}</p>
                            <p><strong>Admin ID:</strong> {report.adminId}</p>
                            <p><strong>Date:</strong> {report.date}</p>
                            <p><strong>Total Transactions:</strong> {report.totalTransactions}</p>
                            <p><strong>Total Amount:</strong> ₱{report.totalAmount}</p>
                        </div>

                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Priority #</th>
                                    <th>Student</th>
                                    <th>Transaction</th>
                                    <th>Semester</th>
                                    <th>Amount</th>
                                    <th>Time Served</th>
                                </tr>
                            </thead>

                            <tbody>
                                {report.tickets.map(ticket => (
                                    <tr key={ticket.queueId}>
                                        <td>{ticket.priorityNumber}</td>
                                        <td>{ticket.studentFullName}</td>
                                        <td>{ticket.transactionType}</td>
                                        <td>{ticket.semester}</td>
                                        <td>₱{ticket.amount}</td>
                                        <td>
                                            {ticket.timeServed
                                                ? new Date(ticket.timeServed).toLocaleTimeString()
                                                : "--"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

            </div>
        </div>
    );
};
export default DailyReportModal;