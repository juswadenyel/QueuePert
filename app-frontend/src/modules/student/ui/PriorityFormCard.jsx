const PriorityFormCard = ({form, onChange, onSubmit }) => (
  <div className="containerPriority">
    <h1>Priority Number Form</h1>
    <p className="description">Please fill in your details</p>

    <label className="input-label">Semester</label>
    <select name="semester" value={form.semester} onChange={onChange}>  {/* ADDED value */}
      <option value="">-- Choose an option --</option>                  {/* ADDED value="" */}
      <option value="First Term">First Term</option>                    {/* ADDED value */}
      <option value="Second Term">Second Term</option>                  {/* ADDED value */}
      <option value="Mid Year Term">Mid Year Term</option>              {/* ADDED value */}
    </select>

    <label className="input-label">Type of Transaction</label>
    <select name="transactionType" value={form.transactionType} onChange={onChange}>  {/* ADDED value */}
      <option value="">-- Choose an option --</option>                                {/* ADDED value="" */}
      <option value="Tuition Payment">Tuition Payment</option>                        {/* ADDED value */}
      <option value="Clearance">Clearance</option>                                    {/* ADDED value */}
      <option value="Enrollment">Enrollment</option>                                  {/* ADDED value */}
    </select>

    <label className="input-label">Amount</label>
    <input
      type="number"
      name="amount"
      placeholder="Enter amount to pay"
      value={form.amount}
      onChange={onChange}
    />

    <button className="action-btn" onClick={onSubmit}>
      Generate
    </button>
  </div>
);

export default PriorityFormCard;