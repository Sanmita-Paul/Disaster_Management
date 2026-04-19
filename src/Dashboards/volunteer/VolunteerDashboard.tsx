import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Tasks from "./Tasks";
import ApplyNGO from "./ApplyNGO";
import ApplicationStatus from "./ApplicationStatus";
import Alerts from "./Alerts";
import MapView from "../../components/MapView";
import "./volunteer.css";

function VolunteerDashboard() {
  const [page, setPage] = useState("home");

  // ✅ location status state must be INSIDE component
  const [locationStatus, setLocationStatus] = useState("loading");
  // loading | granted | denied

  // ✅ SEND LOCATION TO BACKEND
  const sendLocation = async (coords: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await fetch("http://localhost:5000/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          location: coords,
        }),
      });

      console.log("📍 Location updated:", coords);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // ✅ AUTO LOCATION TRACKING
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocationStatus("granted");
        sendLocation(coords);
      },
      (err) => {
        console.log(err.message);
        setLocationStatus("denied");
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // ✅ PAGE RENDER
  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "tasks":
        return <Tasks />;
      case "apply":
        return <ApplyNGO />;
      case "status":
        return <ApplicationStatus />;
      case "alerts":
        return <Alerts />;
      case "map":
        return <MapView role="volunteer" />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="vol-head-welcome">
        <img src="/logo.png" className="vol-logo" />
        <h1>Disaster Management</h1>
      </div>

      {/* MAIN */}
      <div className="vol-dashboard-container">
        <Sidebar setPage={setPage} />

        <div className="vol-dashboard-content">
          {/* ✅ LOCATION STATUS UI */}
          {locationStatus === "loading" && (
            <p style={{ color: "gray", fontSize: "14px", marginBottom: "10px" }}>
              ⏳ Checking location...
            </p>
          )}

          {locationStatus === "granted" && (
            <p style={{ color: "green", fontSize: "14px", marginBottom: "10px" }}>
              📍 Location tracking active
            </p>
          )}

          {locationStatus === "denied" && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              ❌ Location access denied. Please enable browser permission.
            </p>
          )}

          {renderPage()}
        </div>
      </div>
    </>
  );
}

export default VolunteerDashboard;