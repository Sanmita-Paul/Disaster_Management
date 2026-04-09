import { useState } from "react";

const ReportForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Report submitted: ${title} at ${location}`);
  };

  return (
    <div className="page-container">
      <h2>Report Disaster</h2>

      <form className="report-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Disaster Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReportForm;