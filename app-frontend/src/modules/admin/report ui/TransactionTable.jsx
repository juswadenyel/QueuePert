const TransactionTable = ({ tickets }) => (
    <div className="report-breakdown">

        <h3>Transaction Breakdown</h3>

        <table className="report-table">
            <thead>
                <tr>
                    <th>Priority #</th>
                    <th>Student</th>
                    <th>Type</th>
                    <th>Semester</th>
                    <th>Amount</th>
                    <th>Time</th>
                </tr>
            </thead>

            <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket.queueId}>
                        <td>{ticket.priorityNumber}</td>
                        <td>{ticket.studentFullName}</td>
                        <td>{ticket.transactionType}</td>
                        <td>{ticket.semester}</td>
                        <td>₱{ticket.amount}</td>
                        <td>
                            {ticket.timeServed
                                ? new Date(ticket.timeServed).toLocaleTimeString()
                                : "--"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
export default TransactionTable;