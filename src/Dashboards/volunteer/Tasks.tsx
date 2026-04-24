import { useState, useEffect } from "react";
import "./volunteer.css";

function Tasks() {
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const [formData, setFormData] = useState({
    assignment_id: "",
    volunteerId: "",
    status: "completed",
    report: null as File | null,
    images: [] as File[]
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("LOGGED USER:", user);

        // 1. get volunteer id
        const res1 = await fetch(
          `http://localhost:5000/api/get-volunteer/${user.id}`
        );
        const vol = await res1.json();
        console.log("VOLUNTEER FROM API:", vol);

        if (!vol?.id) return;

        // 2. get tasks
        const res2 = await fetch(
          `http://localhost:5000/api/my-tasks/${vol.id}`
        );
        const tasks = await res2.json();
        console.log("TASKS FROM API:", tasks);

        // ✅ only pending tasks
        const pendingTasks = tasks.filter(
          (task: any) => task.assignment_status !== "completed"
        );

        setAssignedTasks(pendingTasks);

        if (pendingTasks.length > 0) {
          const firstTask = pendingTasks[0];

          setSelectedTask(firstTask);

          setFormData({
            assignment_id: String(firstTask.assignment_id),
            volunteerId: String(vol.id),
            status: "completed",
            report: null,
            images: []
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

    if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, report: files[0] });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();

    data.append("assignment_id", formData.assignment_id);
    data.append("remarks", "done");

    if (formData.report) {
      data.append("report", formData.report);
    }

    formData.images.forEach((img) => {
      data.append("images", img);
    });

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

      {/* TASK LIST */}
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
                setSelectedTask(task);

                setFormData({
                  assignment_id: String(task.assignment_id),
                  volunteerId: String(formData.volunteerId),
                  status: "completed",
                  report: null,
                  images: []
                });
              }}
            >
              <p>
                <strong>Task ID:</strong> {task.task_id}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Status:</strong> {task.assignment_status}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SELECTED TASK */}
      {selectedTask && (
        <div className="vol-card">
          <h3>📌 Selected Task</h3>

          <p>
            <strong>Task ID:</strong> {selectedTask.task_id}
          </p>
          <p>
            <strong>Description:</strong> {selectedTask.description}
          </p>
          <p>
            <strong>Status:</strong> {selectedTask.assignment_status}
          </p>
        </div>
      )}

      {/* FORM */}
      <div className="vol-card">
        <label>Assignment ID</label>
        <input
          className="vol-input"
          value={formData.assignment_id}
          readOnly
        />

        <label>Upload Report</label>
        <input
          type="file"
          name="report"
          className="vol-file"
          onChange={handleFileChange}
        />

        <label>Upload Images</label>
        <input
          type="file"
          name="images"
          multiple
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