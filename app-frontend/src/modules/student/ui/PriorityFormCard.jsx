const PriorityFormCard = ({ onChange, onSubmit }) => (
  <div className="containerPriority">
    <h1>Priority Number Form</h1>
    <p className="description">Please fill in your details</p>

    <label className="input-label">ID Number:</label>
    <input type="text" name="id" placeholder="Enter ID Number" onChange={onChange} />

    <label className="input-label">Full Name:</label>
    <input type="text" name="name" placeholder="e.g. Dela Cruz, Juan A." onChange={onChange} />

    <label className="input-label">Year Level</label>
    <select name="year" onChange={onChange}>
      <option>-- Choose an option --</option>
      <option>1st Year</option>
      <option>2nd Year</option>
      <option>3rd Year</option>
      <option>4th Year</option>
    </select>

    <label className="input-label">Semester</label>
    <select name="semester" onChange={onChange}>
      <option>-- Choose an option --</option>
      <option>First Term</option>
      <option>Second Term</option>
      <option>Mid Year Term</option>
    </select>

    <label className="input-label">Type of Transaction</label>
    <select name="transaction" onChange={onChange}>
      <option>-- Choose an option --</option>
      <option>Tuition Payment</option>
      <option>Clearance</option>
      <option>Enrollment</option>
    </select>

    <button className="action-btn" onClick={onSubmit}>
      Generate
    </button>
  </div>
);

export default PriorityFormCard;