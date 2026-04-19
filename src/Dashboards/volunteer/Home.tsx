import "./volunteer.css";
import { useEffect, useState } from "react";

function Home() {

  const [tasks, setTasks] = useState<any[]>([]);
  const [locationStatus, setLocationStatus] = useState("loading");

  const getColor = (severity: string) => {
    if (severity === "high") return { borderLeft: "6px solid red" };
    if (severity === "medium") return { borderLeft: "6px solid orange" };
    return { borderLeft: "6px solid green" };
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        setLocationStatus("granted");

        const dummyTasks = [
          {
            title: "Flood Relief - Area A",
            severity: "high",
            lat: userLat + 0.01,
            lng: userLng + 0.01
          },
          {
            title: "Food Distribution",
            severity: "medium",
            lat: userLat + 0.03,
            lng: userLng + 0.02
          },
          {
            title: "Clothes Sorting",
            severity: "low",
            lat: userLat + 0.05,
            lng: userLng + 0.04
          }
        ];

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);

          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const tasksWithDistance = dummyTasks.map((task) => ({
          ...task,
          distance: Number(
            calculateDistance(userLat, userLng, task.lat, task.lng).toFixed(2)
          )
        }));

        tasksWithDistance.sort((a, b) => a.distance - b.distance);

        setTasks(tasksWithDistance);
      },
      () => {
        setLocationStatus("denied");
      }
    );
  }, []);

  return (
    <div className="vol-home-container">

      <div className="vol-welcome-box">
        <h2>Welcome Volunteer 👋</h2>
        <p>Nearby tasks based on your location</p>

        {/* 🔥 STATUS MESSAGE */}
        {locationStatus === "loading" && (
          <p style={{ color: "gray" }}>⏳ Getting location...</p>
        )}
        {locationStatus === "denied" && (
          <p style={{ color: "red" }}>
            ❌ Enable location to see nearby tasks
          </p>
        )}
      </div>

      {/* 🔥 TASKS ALWAYS RENDER */}
      <div className="vol-task-list">
        {tasks.length === 0 ? (
          <p>No nearby tasks available</p>
        ) : (
          tasks.map((task, index) => (
            <div
              key={index}
              className="vol-task-card"
              style={getColor(task.severity)}
            >
              <h3>{task.title}</h3>
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