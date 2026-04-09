import { useState } from "react";
import Sidebar from "./Sidebar";
import HomePage from "./HomePage";
import Alerts from "./Alerts";
import Nearby from "./Nearby";
import Status from "./Status";
import Contacts from "./Contacts";
import "./volunteer.css";

function Header_login() {
  return (
    <div className="vol-head-welcome">
      <img src="/logo.png" alt="logo" className="vol-logo" />
      <h1>Disaster Management</h1>
    </div>
  );
}

const VolunteerDashboard = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "alerts":
        return <Alerts />;
      case "nearby":
        return <Nearby />;
      case "status":
        return <Status />;
      case "contacts":
        return <Contacts />;
      default:
        return <HomePage />;
    }
  };

  return (
  <>
    <Header_login />
    <div className="vol-dashboard-container">
      <Sidebar setActivePage={setActivePage} />
      <div className="vol-dashboard-content">
        {renderPage()}
      </div>
    </div>
  </>
);

};

export default VolunteerDashboard;
