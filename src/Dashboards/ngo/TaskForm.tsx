import React, { useState } from "react";

interface TaskFormProps {
  location: { id: number; place: string };
  goBack: () => void;
}

interface Volunteer {
  id: number;
  name: string;
  distance: string;
}

const dummyVolunteers: Volunteer[] = [
  { id: 101, name: "Amit Sharma", distance: "2 km" },
  { id: 102, name: "Neha Verma", distance: "3 km" },
  { id: 103, name: "Ravi Kumar", distance: "5 km" },
  { id: 104, name: "Priya Singh", distance: "6 km" },
  { id: 105, name: "Arjun Mehta", distance: "7 km" }
];

const TaskForm: React.FC<TaskFormProps> = ({ location, goBack }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskId, setTaskId] = useState<number | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [numVolunteers, setNumVolunteers] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate dummy task ID
    const newId = Math.floor(Math.random() * 10000);
    setTaskId(newId);
    alert(`Task created with ID: ${newId}`);
  };

  const handleAssign = () => {
    const selected = dummyVolunteers.slice(0, numVolunteers);
    setVolunteers(selected);
    alert(`Assigned ${selected.length} volunteers to task ${taskId}`);
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

          <label>Task Description:</label>
          <textarea
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            required
          />

          <button className="resource-submit-btn" type="submit">
            Submit Task
          </button>
        </form>
      ) : (
        <div className="task-form-card">
          <h3>Task Created ✅</h3>
          <p><strong>ID:</strong> {taskId}</p>
          <p><strong>Name:</strong> {taskName}</p>
          <p><strong>Description:</strong> {taskDesc}</p>
          <p><strong>Location:</strong> {location.place}</p>

          <label>Number of Volunteers:</label>
          <input
            type="number"
            value={numVolunteers}
            onChange={(e) => setNumVolunteers(Number(e.target.value))}
          />
          <button className="accept-btn" onClick={handleAssign}>
            Assign Volunteers
          </button>

          {volunteers.length > 0 && (
            <div className="assigned-volunteers">
              <h4>Assigned Volunteers:</h4>
              <ul>
                {volunteers.map((v) => (
                  <li key={v.id}>
                    {v.name} — {v.distance} away
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button className="view-btn" onClick={goBack}>⬅ Back</button>
    </div>
  );
};

export default TaskForm;
