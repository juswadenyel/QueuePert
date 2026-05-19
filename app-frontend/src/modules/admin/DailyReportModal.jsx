import React, { useEffect, useState } from "react";
import ReportHeader from "./report ui/ReportHeader";
import ReportSummary from "./report ui/ReportSummary";
import TransactionTable from "./report ui/TransactionTable";

const DailyReportModal = ({ open, onClose }) => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (!open) return;

        const admin = JSON.parse(localStorage.getItem("admin"));

        fetch("http://localhost:8080/queue/report/daily", {
            headers: { "X-Admin-Id": admin.adminId }
        })
            .then(res => res.json())
            .then(setReport)
            .catch(console.error);

    }, [open]);

    if (!open) return null;

    return (
        <div className="report-overlay">
            <div className="report-modal">

                <ReportHeader onClose={onClose} />

                {!report ? (
                    <p style={{ padding: 20 }}>Loading...</p>
                ) : (
                    <div className="report-content">

                        <ReportSummary report={report} />

                        <TransactionTable tickets={report.tickets} />

                    </div>
                )}

            </div>
        </div>
    );
};

export default DailyReportModal;