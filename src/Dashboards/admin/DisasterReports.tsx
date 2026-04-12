import { useEffect, useState } from "react";

const DisasterReports: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [reports, setReports] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Record<number, string>>({});

  // 📡 FETCH INCIDENTS
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  // 🌍 REVERSE GEOCODING (OPENSTREETMAP)
  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddresses: Record<number, string> = {};

      await Promise.all(
        reports.map(async (r) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${r.latitude}&lon=${r.longitude}&format=json`
            );
            const data = await res.json();

            newAddresses[r.id] =
              data.display_name || `${r.latitude}, ${r.longitude}`;
          } catch {
            newAddresses[r.id] = `${r.latitude}, ${r.longitude}`;
          }
        })
      );

      setAddresses(newAddresses);
    };

    if (reports.length > 0) {
      fetchAddresses();
    }
  }, [reports]);

  // 🔥 FILTER
  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Disaster Reports</h2>

      <select
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "20px" }}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "15px"
        }}
      >
        {filteredReports.map((r) => (
          <div
            key={r.id}
            style={{
              padding: "15px",
              borderRadius: "10px",
              background: "#f5f5f5",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{r.disaster_type}</h3>

            <p>
              <b>Description:</b> {r.description}
            </p>

            <p>
              <b>Severity:</b> {r.severity}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    r.status === "resolved"
                      ? "green"
                      : r.status === "pending"
                      ? "orange"
                      : "black",
                  fontWeight: "bold"
                }}
              >
                {r.status}
              </span>
            </p>

            {/* 🌍 REAL ADDRESS */}
            <p>
              <b>Location:</b>{" "}
              {addresses[r.id] || "Fetching location..."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisasterReports;