const InfoCard = ({ label, value }) => (
  <div className="queue-card">
    <p>{label}</p>
    <h3>{value || "--"}</h3>
  </div>
);

export default InfoCard;