import { useState } from "react";

const Status = () => {
  const [status, setStatus] = useState("Pending");

  return (
    <div className="page-container">
      <h2>📋 Task Status</h2>

      <div className="card">
        <p>Current Status: {status}</p>

        <button
          className="vol-status-btn"
          onClick={() => setStatus("Completed")}
        >
          Mark Completed
        </button>
      </div>
    </div>
  );
};

export default Status;