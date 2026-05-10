const PriorityFormCard = ({ onChange, onSubmit }) => (
  <div className="containerPriority">
    <h1>Priority Number Form</h1>
    <p className="description">Please fill in your details</p>

    <label className="input-label">Semester</label>
    <select name="semester" onChange={onChange}>
      <option>-- Choose an option --</option>
      <option>First Term</option>
      <option>Second Term</option>
      <option>Mid Year Term</option>
    </select>

    <label className="input-label">Type of Transaction</label>
    <select name="transactionType" onChange={onChange}>
      <option>-- Choose an option --</option>
      <option>Tuition Payment</option>
      <option>Clearance</option>
      <option>Enrollment</option>
    </select>

    <label className="input-label">Amount</label>
    <input
      type="number"
      name="amount"
      placeholder="Enter amount to pay"
      onChange={onChange}
    />

    <button className="action-btn" onClick={onSubmit}>
      Generate
    </button>
  </div>
);

export default PriorityFormCard;