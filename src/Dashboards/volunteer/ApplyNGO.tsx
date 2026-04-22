import { useEffect, useState } from "react";
import "./volunteer.css";

function ApplyNGO() {
  const [ngos, setNgos] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/ngos")
      .then(res => res.json())
      .then(data => setNgos(data))
      .catch(err => console.error(err));
  }, []);

 const handleApply = async (ngoId: string) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  try {
    // ✅ STEP 1: get real volunteer.id
    const volRes = await fetch(
      `http://localhost:5000/api/get-volunteer/${user.id}`
    );
    const volData = await volRes.json();

    const volunteerId = volData.id;

    // ✅ STEP 2: apply
    const res = await fetch("http://localhost:5000/api/apply-ngo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        volunteerId,
        ngoId: Number(ngoId) // ✅ ensure integer
      })
    });

    if (!res.ok) throw new Error("Apply failed");

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