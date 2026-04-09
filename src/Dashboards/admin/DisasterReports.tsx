import { useState } from "react";

const DisasterReports: React.FC = () => {

  const [filter, setFilter] = useState("all");

  const reports = [
    { id: 1, type: "Flood", status: "pending" },
    { id: 2, type: "Fire", status: "resolved" }
  ];

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter(r => r.status === filter);

  return (
    <div style={{ padding: "20px" }}>

      <h2>Disaster Reports</h2>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>

      <ul>
        {filteredReports.map((r) => (
          <li key={r.id}>
            {r.type} - {r.status}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default DisasterReports;