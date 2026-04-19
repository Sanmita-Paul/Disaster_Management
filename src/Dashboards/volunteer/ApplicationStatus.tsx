import "./volunteer.css";

function ApplicationStatus() {
  const applications = [
    { ngo: "Red Cross", status: "Pending" },
    { ngo: "Helping Hands", status: "Approved" }
  ];

  // 🎨 status color
  const getStatusStyle = (status: string) => {
    if (status === "Approved") return { color: "green", fontWeight: "600" };
    if (status === "Pending") return { color: "orange", fontWeight: "600" };
    return { color: "red", fontWeight: "600" };
  };

  return (
    <div className="vol-page-container">
      <h2>Application Status</h2>

      {applications.map((app, index) => (
        <div key={index} className="vol-status-card">
          
          <div className="vol-status-left">
            <h3>{app.ngo}</h3>
            <p>
              Status:{" "}
              <span style={getStatusStyle(app.status)}>
                {app.status}
              </span>
            </p>
          </div>

        </div>
      ))}
    </div>
  );
}

export default ApplicationStatus;