import "./volunteer.css";
import { useEffect, useState } from "react";

function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [locationStatus, setLocationStatus] = useState("loading");
  const [volunteerId, setVolunteerId] = useState<number | null>(null);

  const getColor = (severity: string) => {
    if (severity === "high") return { borderLeft: "6px solid red" };
    if (severity === "medium") return { borderLeft: "6px solid orange" };
    return { borderLeft: "6px solid green" };
  };

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.id) {
    alert("User not logged in");
    return;
  }

  // 🔥 GET LOCATION FIRST
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    setLocationStatus("granted");

    try {
      // 🚀 PARALLEL FETCH (FAST)
      const [volRes, incRes] = await Promise.all([
        fetch(`http://localhost:5000/api/get-volunteer/${user.id}`),
        fetch(`http://localhost:5000/api/incidents`)
      ]);

      const volData = await volRes.json();
      const incidents = await incRes.json();

      setVolunteerId(volData.id);

      // ✅ FILTER ACTIVE
      const activeIncidents = incidents.filter(
        (inc: any) => inc.status !== "resolved"
      );

      // 📏 distance func
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };

      const tasksWithDistance = activeIncidents.map((inc: any) => ({
        title: inc.disaster_type,
        description: inc.description,
        severity: inc.severity || "low",
        distance: Number(
          calculateDistance(userLat, userLng, inc.latitude, inc.longitude).toFixed(2)
        )
      }));

      tasksWithDistance.sort((a: any, b: any) => a.distance - b.distance);

      setTasks(tasksWithDistance);

    } catch (err) {
      console.error(err);
    }
  },
  () => setLocationStatus("denied"));
}, []);

  return (
    <div className="vol-home-container">

      <div className="vol-welcome-box">
        <h2>
          Welcome Volunteer 👋 
          {volunteerId && <span> (ID: {volunteerId})</span>}
        </h2>

        <p>Nearby active incidents based on your location</p>

        {locationStatus === "loading" && (
          <p style={{ color: "gray" }}>⏳ Getting location...</p>
        )}
        {locationStatus === "denied" && (
          <p style={{ color: "red" }}>
            ❌ Enable location to see nearby incidents
          </p>
        )}
      </div>

      <div className="vol-task-list">
        {tasks.length === 0 ? (
          <p>No active incidents nearby</p>
        ) : (
          tasks.map((task, index) => (
            <div
              key={index}
              className="vol-task-card"
              style={getColor(task.severity)}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.severity}</p>
              <p>📍 Distance: {task.distance} km</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Home;