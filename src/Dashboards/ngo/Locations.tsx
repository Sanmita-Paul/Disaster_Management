import React, { useState } from "react";
import TaskForm from "./TaskForm";

interface Location {
  id: number;
  place: string;
}

const Locations: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    { id: 1, place: "Mumbai Flood Zone" },
    { id: 2, place: "Delhi Fire Area" },
    { id: 3, place: "Kerala Landslide Region" }
  ];

  if (selectedLocation) {
    return <TaskForm location={selectedLocation} goBack={() => setSelectedLocation(null)} />;
  }

  return (
    <div className="page-container">
      <h2>Locations Needing Support</h2>
      {locations.map((l) => (
        <div className="card" key={l.id}>
          <p>{l.place}</p>
          <button className="view-btn" onClick={() => setSelectedLocation(l)}>
            Create Task
          </button>
        </div>
      ))}
    </div>
  );
};

export default Locations;
