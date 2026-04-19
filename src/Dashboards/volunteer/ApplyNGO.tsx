import { useEffect, useState } from "react";
import "./volunteer.css";

function ApplyNGO() {
  const [ngos, setNgos] = useState<any[]>([]);

  // 🔁 SWITCH BETWEEN DUMMY & BACKEND
  const USE_DUMMY = true;

  useEffect(() => {
    if (USE_DUMMY) {
      // ✅ DUMMY DATA
      const dummyData = [
        { id: "NGO101", name: "Red Cross", location: "Delhi" },
        { id: "NGO102", name: "Helping Hands", location: "Mumbai" },
        { id: "NGO103", name: "Care India", location: "Kolkata" }
      ];

      setNgos(dummyData);
    } else {
      // 🔗 BACKEND FETCH
      fetch("http://localhost:5000/ngos")
        .then(res => res.json())
        .then(data => setNgos(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleApply = async (ngoId: string) => {
    // ✅ GET USER FROM LOCAL STORAGE
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const volunteerId = user._id;

    if (USE_DUMMY) {
      // 🧪 FRONTEND TEST MODE
      alert(`✅ Applied to NGO: ${ngoId}`);
      return;
    }

    try {
      await fetch("http://localhost:5000/apply-ngo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          volunteerId,
          ngoId
        })
      });

      alert("✅ Applied successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Application failed!");
    }
  };

  return (
    <div className="vol-page-container">
      <h2>Apply to NGOs</h2>

      <table className="vol-table">
        <thead>
          <tr>
            <th>NGO ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {ngos.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No NGOs available
              </td>
            </tr>
          ) : (
            ngos.map((ngo, index) => (
              <tr key={index}>
                <td>{ngo.id}</td>
                <td>{ngo.name}</td>
                <td>{ngo.location}</td>
                <td>
                  <button
                    className="vol-status-btn"
                    onClick={() => handleApply(ngo.id)}
                  >
                    Apply
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApplyNGO;