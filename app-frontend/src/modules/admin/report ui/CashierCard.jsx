const CashierCard = ({ adminId, adminName }) => (
    <div className="summary-card cashier-card">
        <p className="label">Cashier ID</p>
        <p className="value small">{adminId}</p>

        <div className="divider"></div>

        <p className="label">Cashier Name</p>
        <p className="value">{adminName}</p>
    </div>
);

export default CashierCard;