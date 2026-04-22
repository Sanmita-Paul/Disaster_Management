import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";

interface Location {
  id: number;
  place: string;
  description: string;
  disaster_type: string;
}

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [ngoId, setNgoId] = useState<number | null>(null); // ✅ added

  // 🌍 Convert lat/lng → place name
  const getPlaceName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || "Unknown Location";
    } catch {
      return "Unknown Location";
    }
  };

  // ✅ FETCH NGO ID (added)
  useEffect(() => {
    const fetchNgo = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/get-ngo/${user.id}`
        );
        const data = await res.json();
        setNgoId(data.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNgo();
  }, []);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents");
        const data = await res.json();

        // ✅ Only pending incidents
        const pending = data.filter((i: any) => i.status === "pending");

        // 🌍 Convert all lat/lng → names
        const formatted = await Promise.all(
          pending.map(async (i: any) => {
            const placeName = await getPlaceName(i.latitude, i.longitude);

            return {
              id: i.id,
              place: placeName,
              description: i.description,
              disaster_type: i.disaster_type
            };
          })
        );

        setLocations(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIncidents();
  }, []);

  // ✅ FIXED: pass required props ONLY when ready
  if (selectedLocation && ngoId) {
    return (
      <TaskForm
        location={selectedLocation}
        ngoId={ngoId}
        incidentId={selectedLocation.id}
        goBack={() => setSelectedLocation(null)}
      />
    );
  }

  return (
    <div className="page-container">
      <h2>Locations Needing Support</h2>

      {locations.length === 0 && <p>No pending incidents</p>}

      {locations.map((l) => (
        <div className="card" key={l.id}>
          <p><b>{l.place}</b></p>
          <p>Type: {l.disaster_type}</p>
          <p>{l.description}</p>

          <button
            className="view-btn"
            onClick={() => setSelectedLocation(l)}
          >
            Create Task
          </button>
        </div>
      ))}
    </div>
  );
};

export default Locations;