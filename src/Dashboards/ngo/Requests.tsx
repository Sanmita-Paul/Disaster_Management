import { useEffect, useState } from "react";

const AllTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>(([]));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) return;

    // 🔥 STEP 1: get NGO ID
    fetch(`http://localhost:5000/api/get-ngo/${user.id}`)
      .then((res) => res.json())
      .then((ngoData) => {

        const ngoId = ngoData.id;

        // 🔥 STEP 2: fetch tasks using NGO ID
        return fetch(`http://localhost:5000/api/ngo-tasks/${ngoId}`);
      })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));

  }, []);

  return (
    <div className="page-container">
      <h2>NGO Tasks</h2>

      {tasks.map((t, i) => (
        <div className="card" key={i}>
          <p><b>Task ID:</b> {t.task_id}</p>
          <p><b>Description:</b> {t.description}</p>
          <p><b>Priority:</b> {t.priority || "Normal"}</p>

          <p><b>Volunteer:</b> {t.volunteer_name || "Not Assigned"}</p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color: t.assignment_status === "completed" ? "green" : "orange",
                fontWeight: "600"
              }}
            >
              {t.assignment_status || "pending"}
            </span>
          </p>

          {t.assignment_status === "completed" && (
            <>
              <p><b>Remarks:</b> {t.remarks}</p>

              {t.proof_url && (
                <a
                  href={`http://localhost:5000${t.proof_url}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginRight: "10px" }}
                >
                  View Proof
                </a>
              )}

              {t.report_pdf_url && (
                <a
                  href={`http://localhost:5000${t.report_pdf_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Report
                </a>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllTasks;