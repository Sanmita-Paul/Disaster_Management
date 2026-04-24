import React, { useEffect, useState } from "react";

interface TaskFormProps {
  location: { id: number; place: string };
  ngoId: number;
  incidentId: number;
  goBack: () => void;
}

interface Volunteer {
  id: number;
  name: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  location,
  ngoId,
  incidentId,
  goBack
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);

  const [allVolunteers, setAllVolunteers] = useState<Volunteer[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [numVolunteers, setNumVolunteers] = useState(0);

  const [loading, setLoading] = useState(false);

  // ✅ FETCH VOLUNTEERS (backend)
  useEffect(() => {
    fetch(`http://localhost:5000/api/available-volunteers/${ngoId}`)
      .then((res) => res.json())
      .then((data) => setAllVolunteers(data))
      .catch(console.error);
  }, [ngoId]);

  // ✅ CREATE TASK (backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName || !taskDesc) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          incident_id: incidentId,
          ngo_id: ngoId,
          description: taskDesc,
          priority: "medium"
        })
      });
const data = await res.json();

if (!data.task_id) {
  alert("Task creation failed");
  return;
}
    
setTaskId(data.task_id); // ✅ now guaranteed
alert("Task created successfully");
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ASSIGN VOLUNTEERS (same UI logic, backend integrated)
  const handleAssign = async () => {
    const selected = allVolunteers.slice(0, numVolunteers);
    setVolunteers(selected);

    try {
      setLoading(true);

      await fetch("http://localhost:5000/api/assign-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task_id: taskId,
          volunteer_ids: selected.map((v) => v.id)
        })
      });

      alert(`Assigned ${selected.length} volunteers to task`);

    } catch (err) {
      console.error(err);
      alert("Error assigning volunteers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Create Task for {location.place}</h2>

      {!taskId ? (
        <form onSubmit={handleSubmit} className="task-form-card">

  <label>Task Name:</label>
  <input
    type="text"
    value={taskName}
    onChange={(e) => setTaskName(e.target.value)}
    required
  />

  <br /><br />

  <label>Task Description:</label>
  <textarea
    value={taskDesc}
    onChange={(e) => setTaskDesc(e.target.value)}
    required
  />

  <br /><br />

  <button className="resource-submit-btn" type="submit" disabled={loading}>
    {loading ? "Creating..." : "Submit Task"}
  </button>

</form>
      ) : (
       <div className="task-form-card">
  <h3>Task Created ✅</h3>

  <p><strong>ID:</strong> {taskId}</p>
  <p><strong>Name:</strong> {taskName}</p>
  <p><strong>Description:</strong> {taskDesc}</p>
  <p><strong>Location:</strong> {location.place}</p>

  <br />

  <label>Number of Volunteers:</label>
  <input
    type="number"
    value={numVolunteers}
    onChange={(e) => setNumVolunteers(Number(e.target.value))}
  />

  <br /><br />

  <button className="accept-btn" onClick={handleAssign} disabled={loading}>
    {loading ? "Assigning..." : "Assign Volunteers"}
  </button>

  {volunteers.length > 0 && (
    <div className="assigned-volunteers">
      <h4>Assigned Volunteers:</h4>
      <ul>
        {volunteers.map((v) => (
          <li key={v.id}>{v.name}</li>
        ))}
      </ul>
    </div>
  )}
</div>
      )}

      <button className="view-btn" onClick={goBack}>
        ⬅ Back
      </button>
    </div>
  );
};

export default TaskForm;