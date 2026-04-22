import { useEffect, useState } from "react";

interface Incident {
  id: number;
  disaster_type: string;
  description: string;
  status: string;
}

const Status: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchIncidents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        alert("User not logged in");
        return;
      }

      const res = await fetch("http://localhost:5000/api/incidents");

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();

      // ✅ FILTER HERE (IMPORTANT)
      const userIncidents = data.filter(
        (incident: any) => incident.user_id === user.id
      );

      setIncidents(userIncidents);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchIncidents();
}, []);
  return (
    <div className="page-container">
      <h2>Your Reports</h2>

      {loading ? (
        <p>Loading...</p>
      ) : incidents.length === 0 ? (
        <p>No reports yet</p>
      ) : (
        incidents.map((d) => (
          <div key={d.id} className="card">
            <h3>{d.disaster_type}</h3>
            <p>{d.description}</p>
            <p>Status: {d.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Status;