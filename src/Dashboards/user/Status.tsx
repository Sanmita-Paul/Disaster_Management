import { useEffect, useState } from "react";

interface StatusRow {
  incident_id: number;
  description: string;
  disaster_type: string;
  incident_status: string;
  task_status: string;
  assignment_status: string;
  report_id: number | null;
}

const Status: React.FC = () => {
  const [data, setData] = useState<StatusRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user.id) {
          alert("User not logged in");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/user-full-status/${user.id}`
        );

        if (!res.ok) {
          console.error(await res.text());
          return;
        }

        const result = await res.json();
        setData(result);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="page-container">
      <h2>Your Full Status</h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No records found</p>
      ) : (
        data.map((item, index) => (
         <div key={index} className="card">
  <h3>{item.disaster_type}</h3>
  <p>{item.description}</p>

  <p>Incident Status: {item.incident_status}</p>

  {/* 👇 ADD THESE (or keep if already there, just ensure visible) */}
  <p>Task Status: {item.task_status || "not assigned"}</p>
<p>Assignment Status: {item.assignment_status || "not assigned"}</p>

  <p>
    Report: {item.report_id ? "Submitted ✅" : "Not submitted ❌"}
  </p>
</div>
        ))
      )}
    </div>
  );
};

export default Status;