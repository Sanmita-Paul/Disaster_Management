import { useState, useEffect } from "react";
import "./volunteer.css";

function Tasks() {

  // 🟢 ASSIGNED TASK (FROM BACKEND LATER)
  const [assignedTask, setAssignedTask] = useState<any>(null);

  // 🟢 FORM STATE
  const [formData, setFormData] = useState({
    taskId: "",
    volunteerId: "",
    disasterId: "",
    status: "Pending",
    report: null as File | null,
    images: [] as File[]
  });

  // ✅ FETCH TASK (DUMMY FOR NOW)
  useEffect(() => {
    // 🔥 Replace this with backend API later
    const dummyTask = {
      taskId: "T101",
      disasterId: "D45",
      description: "Rescue people from flooded area",
      location: "Assam, India"
    };

    setAssignedTask(dummyTask);

    // 🔥 AUTO-FILL FORM
    setFormData((prev) => ({
      ...prev,
      taskId: dummyTask.taskId,
      disasterId: dummyTask.disasterId
    }));

  }, []);

  // 🟢 INPUT CHANGE
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🟢 FILE CHANGE
  const handleFileChange = (e: any) => {
    const { name, files } = e.target;

    if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, report: files[0] });
    }
  };

  // 🟢 SUBMIT
  const handleSubmit = async () => {
    const data = new FormData();

    data.append("taskId", formData.taskId);
    data.append("volunteerId", formData.volunteerId);
    data.append("disasterId", formData.disasterId);
    data.append("status", formData.status);

    if (formData.report) {
      data.append("report", formData.report);
    }

    formData.images.forEach((img) => {
      data.append("images", img);
    });

    try {
      await fetch("http://localhost:5000/upload-task", {
        method: "POST",
        body: data
      });

      alert("✅ Uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Upload failed!");
    }
  };

  return (
    <div className="vol-page-container">

      <h2>Task Submission</h2>

      {/* 🔥 ASSIGNED TASK SECTION */}
      {assignedTask && (
        <div className="vol-card">
          <h3>📌 Assigned Task</h3>

          <p><strong>Task ID:</strong> {assignedTask.taskId}</p>
          <p><strong>Disaster ID:</strong> {assignedTask.disasterId}</p>
          <p><strong>Description:</strong> {assignedTask.description}</p>
          <p><strong>Location:</strong> {assignedTask.location}</p>
        </div>
      )}

      {/* 🟢 FORM */}
      <div className="vol-card">

        <label>Task ID</label>
        <input
          className="vol-input"
          name="taskId"
          value={formData.taskId}
          readOnly   // 🔥 auto-filled
        />

        <label>Volunteer ID</label>
        <input
          className="vol-input"
          name="volunteerId"
          placeholder="Enter Volunteer ID"
          onChange={handleChange}
        />

        <label>Disaster ID</label>
        <input
          className="vol-input"
          name="disasterId"
          value={formData.disasterId}
          readOnly   // 🔥 auto-filled
        />

        <label>Status</label>
        <select
          className="vol-input"
          name="status"
          onChange={handleChange}
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>

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
          Upload
        </button>

      </div>
    </div>
  );
}

export default Tasks;