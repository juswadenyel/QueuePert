const ReportHeader = ({ onClose }) => (
    <div className="report-header">
        <div>
            <h2>Daily Cashier Report</h2>
            <p className="report-subtitle">
                Transaction Summary & Audit Log
            </p>
        </div>

        <button className="close-btn" onClick={onClose}>✕</button>
    </div>
);

export default ReportHeader;