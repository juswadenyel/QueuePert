import React from "react";
import StatCard from "./StatCard";

const ReportSummary = ({ report }) => {
    return (
        <div className="report-summary-grid">

            {/* CASHIER ID */}
            <div className="summary-card">
                <p className="label">Cashier ID</p>
                <p className="value">{report.adminId}</p>
            </div>

            {/* CASHIER NAME */}
            <div className="summary-card">
                <p className="label">Cashier Name</p>
                <p className="value">{report.adminName}</p>
            </div>

            {/* OTHER STATS */}
            <StatCard label="Date" value={report.date} />
            <div className="summary-group">
                <StatCard
                    label="Total Transactions"
                    value={report.totalTransactions}
                />

                <StatCard
                    label="Total Amount"
                    value={`₱${report.totalAmount}`}
                    highlight
                />
            </div>

        </div>
    );
};

export default ReportSummary;   