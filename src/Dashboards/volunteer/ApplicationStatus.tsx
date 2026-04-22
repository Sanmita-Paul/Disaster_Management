import "./volunteer.css";
import { useEffect, useState } from "react";

interface Application {
  application_id: string;
  ngo_name: string;
  status: string;
}

function ApplicationStatus() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎨 status color
  const getStatusStyle = (status: string) => {
    if (status === "accepted") return { color: "green", fontWeight: "600" };
    if (status === "pending") return { color: "orange", fontWeight: "600" };
    return { color: "red", fontWeight: "600" };
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user.id) {
          alert("User not logged in");
          return;
        }

        // ✅ STEP 1: get volunteer_id
        const res1 = await fetch(
          `http://localhost:5000/api/get-volunteer/${user.id}`
        );

        if (!res1.ok) {
          console.error(await res1.text());
          return;
        }

        const volData = await res1.json();

        // ✅ STEP 2: fetch applications
        const res2 = await fetch(
          `http://localhost:5000/api/volunteer-applications/${volData.id}`
        );

        if (!res2.ok) {
          console.error(await res2.text());
          return;
        }

        const data = await res2.json();
        setApplications(data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="vol-page-container">
      <h2>Application Status</h2>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        applications.map((app) => (
          <div key={app.application_id} className="vol-status-card">
            <div className="vol-status-left">
              <h3>{app.ngo_name}</h3>
              <p>
                Status:{" "}
                <span style={getStatusStyle(app.status)}>
                  {app.status}
                </span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ApplicationStatus;