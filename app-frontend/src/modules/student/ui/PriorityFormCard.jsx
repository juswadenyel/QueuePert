const PriorityFormCard = ({form, onChange, onSubmit }) => (
  <div className="containerPriority">
    <h1>Priority Number Form</h1>
    <p className="description">Please fill in your details</p>

    <label className="input-label">Semester</label>
    <select name="semester" value={form.semester} onChange={onChange}>
      <option value="">-- Choose an option --</option>
      <option value="First Term">First Term</option>
      <option value="Second Term">Second Term</option>
      <option value="Mid Year Term">Mid Year Term</option>
    </select>

    <label className="input-label">Type of Transaction</label>
    <select name="transactionType" value={form.transactionType} onChange={onChange}>  
      <option value="">-- Choose an option --</option>                               
      <option value="Tuition Payment">Tuition Payment</option>                        
      <option value="Clearance">Clearance</option>                                    
      <option value="Enrollment">Enrollment</option>                                  
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