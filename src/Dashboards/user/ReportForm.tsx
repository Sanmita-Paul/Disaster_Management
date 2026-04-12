import { useState } from "react";

const ReportForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const res = await fetch("http://localhost:5000/api/incidents", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.id,
                description,
                disaster_type: disasterType,
                severity,
                latitude,
                longitude
              })
            });

            const data = await res.json();

            if (res.ok) {
              alert("Incident reported successfully!");
            } else {
              alert(data.message || "Error reporting incident");
            }

            setDescription("");
            setDisasterType("");
            setSeverity("");
            setLoading(false);

          } catch (error) {
            console.error(error);
            alert("Error sending data");
            setLoading(false);
          }
        },
        () => {
          alert("Location permission denied");
          setLoading(false);
        }
      );

    } catch (error) {
      console.error(error);
      alert("Unexpected error");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Report Disaster</h2>

      <form className="report-form" onSubmit={handleSubmit}>

        <textarea
          placeholder="Describe the situation"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br />

        <input
          type="text"
          placeholder="Disaster Type (flood, fire, etc.)"
          value={disasterType}
          onChange={(e) => setDisasterType(e.target.value)}
          required
        />

        <br />

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          required
        >
          <option value="">Select Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
};

export default ReportForm;