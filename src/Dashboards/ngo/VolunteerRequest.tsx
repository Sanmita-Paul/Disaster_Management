import React, { useEffect, useState } from "react";

interface VolunteerRequest {
  id: number;
  name: string;
  age: number;
  gender: string;
  aadhar: string;
  idProofImage: string;
  volunteerImage: string;
  skills: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

const VolunteerRequests: React.FC = () => {
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchData = async () => {
      try {
        // ✅ STEP 1: get correct NGO id
        const ngoRes = await fetch(
          `http://localhost:5000/api/get-ngo/${user.id}`
        );
        const ngoData = await ngoRes.json();

        const ngoId = ngoData.id;

        // ✅ STEP 2: fetch applications
        const res = await fetch(
          `http://localhost:5000/api/ngo-applications/${ngoId}`
        );
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item.application_id,
          name: item.name,
          age: item.age,
          gender: item.gender,
          aadhar: item.aadhaar_number,
          idProofImage: "http://localhost:5000" + item.id_proof_url,
          volunteerImage: "http://localhost:5000" + item.image_url,
          skills: "N/A",
          status:
            item.status === "pending"
              ? "Pending"
              : item.status === "accepted"
              ? "Approved"
              : "Rejected",
          date: item.applied_at
        }));

        setRequests(formatted);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async () => {
    if (!selectedVolunteer) return;

    await fetch("http://localhost:5000/api/update-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: selectedVolunteer.id,
        status: "accepted"
      })
    });

    window.location.reload();
  };

  const handleReject = async () => {
    if (!selectedVolunteer) return;

    await fetch("http://localhost:5000/api/update-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: selectedVolunteer.id,
        status: "rejected"
      })
    });

    window.location.reload();
  };

  return (
    <div className="volunteer-requests">
      <h2>🙋 Volunteer Requests</h2>

      <div className="volunteer-list">
        {requests.map(req => (
          <div key={req.id} className="volunteer-card">
            <div className="volunteer-info">
              <h3>{req.name}</h3>
              <small>{req.date}</small>
            </div>

            <div>
              <span
                className={`status-badge ${
                  req.status === "Pending"
                    ? "status-pending"
                    : req.status === "Approved"
                    ? "status-approved"
                    : "status-rejected"
                }`}
              >
                {req.status}
              </span>

              <button
                className="view-btn"
                onClick={() => setSelectedVolunteer(req)}
              >
                View More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedVolunteer && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setSelectedVolunteer(null)}
          ></div>

          <div className="volunteer-modal">
            <h3>{selectedVolunteer.name}</h3>

            <p><strong>Age:</strong> {selectedVolunteer.age}</p>
            <p><strong>Gender:</strong> {selectedVolunteer.gender}</p>
            <p><strong>Aadhaar:</strong> {selectedVolunteer.aadhar}</p>
            <p><strong>Status:</strong> {selectedVolunteer.status}</p>
            <p><strong>Date:</strong> {selectedVolunteer.date}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <div>
                <strong>ID Proof:</strong>
                <img
                  src={selectedVolunteer.idProofImage}
                  alt="ID Proof"
                  style={{ width: "100px", borderRadius: "6px" }}
                />
              </div>

              <div>
                <strong>Volunteer Image:</strong>
                <img
                  src={selectedVolunteer.volunteerImage}
                  alt="Volunteer"
                  style={{ width: "100px", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div className="request-actions" style={{ marginTop: "20px" }}>
              <button className="accept-btn" onClick={handleApprove}>
                Approve
              </button>

              <button className="reject-btn" onClick={handleReject}>
                Decline
              </button>

              <button
                className="view-btn"
                onClick={() => setSelectedVolunteer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerRequests;