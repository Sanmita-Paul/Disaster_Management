import { useState } from "react";
import "./ngo.css";
import MapView from "../../components/MapView";

import Requests from "./Requests";
import Resources from "./Resources";
import Locations from "./Locations";
import VolunteerRequests from "./VolunteerRequest"; 
import NGOHome from "./NGOHome";

function Header_login(){
  return(
    <div className='head_ngo'>
      <img src="/logo.png" alt="logo" className="logo" />
      <h1>Disaster Management</h1>
    </div>
  )
}

const NGODashboard: React.FC = () => {

  const [page, setPage] = useState<string>("home");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const renderPage = () => {
    switch(page){
      case "home": return <NGOHome />;
     
      case "resources": return <Resources />;
      case "locations": return <Locations />;
      case "map": return <MapView role="NGO" />;
      case "volunteerRequests": return <VolunteerRequests />;
      default: return <Requests />;
    }
  };

  return (
    <div className="ngo-app"> {/* ✅ FIXED WRAPPER */}

      <Header_login />

      <div className="ngo-dashboard-container">

        <div className="ngo-sidebar">
          <h2>NGO Panel</h2>

          <button onClick={() => setPage("home")}>🏠 Home</button>
          <button onClick={() => setPage("resources")}>📦 Resource Form</button>
          <button onClick={() => setPage("locations")}>📍 Locations</button>
          <button onClick={() => setPage("alltasks")}>📍 Task Status</button>
          <button onClick={() => setPage("map")}>🗺️ Map</button>
          <button onClick={() => setPage("volunteerRequests")}>🙋 Volunteers</button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <div className="ngo-content">
          {renderPage()}
        </div>

      </div>
    </div>
  );
};

export default NGODashboard;