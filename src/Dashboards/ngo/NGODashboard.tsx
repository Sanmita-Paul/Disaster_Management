import { useState } from "react";
import "./ngo.css";
import MapView from "../../components/MapView";

import Requests from "./Requests";
import Resources from "./Resources";
import Locations from "./Locations";
import Contributions from "./Contributions";

function Header_login(){
  return(
    <div className='head_ngo'>
      <img src="/logo.png" alt="logo" className="logo" />
      <h1>Disaster Management</h1>
    </div>
  )
}

const NGODashboard: React.FC = () => {

  const [page, setPage] = useState<string>("requests");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    window.location.href = "/";
  };

  const renderPage = () => {
    switch(page){
      case "requests":
        return <Requests />;
      case "resources":
        return <Resources />;
      case "locations":
        return <Locations />;
      case "contributions":
        return <Contributions />;
      case "map":
        return <MapView role="NGO" />;
      default:
        return <Requests />;
    }
  };

  return (
    <div>

      <Header_login />

      <div className="ngo-dashboard-container">

        {/* Sidebar */}
        <div className="ngo-sidebar">

          <h2>NGO Panel</h2>

          <button onClick={() => setPage("requests")}>
            🚨 Disaster Requests
          </button>

          <button onClick={() => setPage("resources")}>
            📦 Resource Requests
          </button>

          <button onClick={() => setPage("locations")}>
            📍 Locations Needing Help
          </button>

          <button onClick={() => setPage("contributions")}>
            📊 Track Contributions
          </button>
          
          <button onClick={() => setPage("map")}>
          🗺️ Map
          </button>

          {/* Logout */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

        {/* Content */}
        <div className="ngo-content">
          {renderPage()}
        </div>

      </div>

    </div>
  );
};

export default NGODashboard;