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
    // Replace with your actual data fetch (API or IndexedDB)
    const sampleData: VolunteerRequest[] = [
      {
        id: 1,
        name: "Amit Sharma",
        age: 28,
        gender: "Male",
        aadhar: "1234-5678-9012",
        idProofImage: "/images/idproof1.png",
        volunteerImage: "/images/volunteer1.png",
        skills: "Medical Aid",
        status: "Pending",
        date: "2026-04-16"
      },
      {
        id: 2,
        name: "Neha Verma",
        age: 25,
        gender: "Female",
        aadhar: "9876-5432-1098",
        idProofImage: "/images/idproof2.png",
        volunteerImage: "/images/volunteer2.png",
        skills: "Logistics",
        status: "Approved",
        date: "2026-04-15"
      }
    ];
    setRequests(sampleData);
  }, []);

  const handleApprove = () => {
    if (selectedVolunteer) {
      setRequests(prev =>
        prev.map(req =>
          req.id === selectedVolunteer.id ? { ...req, status: "Approved" } : req
        )
      );
      setSelectedVolunteer(null);
    }
  };

  const handleReject = () => {
    if (selectedVolunteer) {
      setRequests(prev =>
        prev.map(req =>
          req.id === selectedVolunteer.id ? { ...req, status: "Rejected" } : req
        )
      );
      setSelectedVolunteer(null);
    }
  };

  return (
    <div className="volunteer-requests">
      <h2>🙋 Volunteer Requests</h2>
      <div className="volunteer-list">
        {requests.map(req => (
          <div key={req.id} className="volunteer-card">
            <div className="volunteer-info">
              <h3>{req.name}</h3>
              <p>{req.skills}</p>
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

      {/* Modal for volunteer details */}
      {selectedVolunteer && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}></div>
          <div className="volunteer-modal">
            <h3>{selectedVolunteer.name}</h3>
            <p><strong>Age:</strong> {selectedVolunteer.age}</p>
            <p><strong>Gender:</strong> {selectedVolunteer.gender}</p>
            <p><strong>Aadhaar:</strong> {selectedVolunteer.aadhar}</p>
            <p><strong>Skills:</strong> {selectedVolunteer.skills}</p>
            <p><strong>Status:</strong> {selectedVolunteer.status}</p>
            <p><strong>Date:</strong> {selectedVolunteer.date}</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <div>
                <strong>ID Proof:</strong>
                <img src={selectedVolunteer.idProofImage} alt="ID Proof" style={{ width: "100px", borderRadius: "6px" }} />
              </div>
              <div>
                <strong>Volunteer Image:</strong>
                <img src={selectedVolunteer.volunteerImage} alt="Volunteer" style={{ width: "100px", borderRadius: "6px" }} />
              </div>
            </div>
            <div className="request-actions" style={{ marginTop: "20px" }}>
              <button className="accept-btn" onClick={handleApprove}>Approve</button>
              <button className="reject-btn" onClick={handleReject}>Decline</button>
              <button className="view-btn" onClick={() => setSelectedVolunteer(null)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerRequests;
