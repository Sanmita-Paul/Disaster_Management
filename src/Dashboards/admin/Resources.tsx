import { useEffect, useState } from "react";

const Resources: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);

  // 📡 FETCH RESOURCES
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resources");
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };

    fetchResources();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resource Management</h2>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px"
        }}
      >
        {resources.map((r) => (
          <div
            key={r.id}
            style={{
              padding: "15px",
              borderRadius: "10px",
              background: "#f5f5f5",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{r.resource_type}</h3>

            <p>
              <b>Quantity:</b> {r.quantity}
            </p>

            <p>
              <b>Availability:</b>{" "}
              <span
                style={{
                  color: r.availability ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                {r.availability ? "Available" : "Not Available"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;