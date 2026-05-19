const StatCard = ({ label, value, highlight }) => (
    <div className={`summary-card ${highlight ? "highlight" : ""}`}>
        <p className="label">{label}</p>
        <p className="value">{value}</p>
    </div>
);
export default StatCard;