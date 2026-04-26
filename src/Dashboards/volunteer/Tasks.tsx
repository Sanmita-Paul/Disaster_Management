import { useState, useEffect } from "react";
import "./volunteer.css";

function Tasks() {
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    assignment_id: "",
    volunteerId: "",
    status: "completed",
    report: null as File | null,
    proof: null as File | null   // ✅ ADDED
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const res1 = await fetch(
          `http://localhost:5000/api/get-volunteer/${user.id}`
        );
        const vol = await res1.json();

        if (!vol?.id) return;

        const res2 = await fetch(
          `http://localhost:5000/api/my-tasks/${vol.id}`
        );
        const tasks = await res2.json();

        const pendingTasks = tasks.filter(
          (task: any) => task.assignment_status !== "completed"
        );

        setAssignedTasks(pendingTasks);

        if (pendingTasks.length > 0) {
          const firstTask = pendingTasks[0];

          setFormData({
            assignment_id: String(firstTask.assignment_id),
            volunteerId: String(vol.id),
            status: "completed",
            report: null,
            proof: null   // ✅ CHANGED
          });
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTask();
  }, []);

  const handleFileChange = (e: any) => {
    const { name, files } = e.target;

    if (name === "proof") {
      setFormData({ ...formData, proof: files[0] }); // ✅ NEW
    } else {
      setFormData({ ...formData, report: files[0] });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();

    data.append("assignment_id", formData.assignment_id);
    data.append("remarks", "done");

    if (formData.proof) {
      data.append("proof", formData.proof); // ✅ NEW
    }

    if (formData.report) {
      data.append("report", formData.report);
    }

    try {
      const res = await fetch(
        "http://localhost:5000/complete-assignment",
        {
          method: "POST",
          body: data
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert("✅ Task Completed Successfully!");
        window.location.reload();
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network Error");
    }
  };

  return (
    <div className="vol-page-container">
      <h2>Task Submission</h2>

      {assignedTasks.length > 0 && (
        <div className="vol-card">
          <h3>📌 Pending Tasks</h3>

          {assignedTasks.map((task) => (
            <div
              key={task.assignment_id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                cursor: "pointer",
                borderRadius: "6px"
              }}
              onClick={() => {
                setFormData({
                  assignment_id: String(task.assignment_id),
                  volunteerId: String(formData.volunteerId),
                  status: "completed",
                  report: null,
                  proof: null   // ✅ CHANGED
                });
              }}
            >
              <p><strong>Task ID:</strong> {task.task_id}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Status:</strong> {task.assignment_status}</p>
            </div>
          ))}
        </div>
      )}

      {assignedTasks.length === 0 && (
        <div className="vol-card">
          <h3>📌 Pending Tasks</h3>
          <p style={{ color: "gray" }}>No pending tasks</p>
        </div>
      )}

      <div className="vol-card">
        <label>Assignment ID</label>
        <input
          className="vol-input"
          value={formData.assignment_id}
          readOnly
        />

        {/* ✅ NEW FIELD */}
        <label>Upload Proof (image/pdf)</label>
        <input
          type="file"
          name="proof"
          className="vol-file"
          onChange={handleFileChange}
        />

        {/* existing */}
        <label>Upload Report</label>
        <input
          type="file"
          name="report"
          className="vol-file"
          onChange={handleFileChange}
        />

        <button className="vol-status-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Tasks;