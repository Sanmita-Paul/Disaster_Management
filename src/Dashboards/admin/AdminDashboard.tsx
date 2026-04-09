import { useState } from "react";
import "./admin.css";
import AdminSidebar from "./AdminSidebar";

import Stats from "./Stats";
import DisasterReports from "./DisasterReports";
import MapView from "./MapView";
import Resources from "./Resources";
import ManageUsers from "./ManageUsers";
import Analytics from "./Analytics";

/* HEADER */
function Header_login() {
  return (
    <div className="head_admin">
      <img src="/logo.png" alt="logo" className="logo" />
      <h1>Disaster Management</h1>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [page, setPage] = useState<string>("stats");

  const renderPage = () => {
    switch (page) {
      case "stats":
        return <Stats />;
      case "reports":
        return <DisasterReports />;
      case "map":
        return <MapView />;
      case "resources":
        return <Resources />;
      case "users":
        return <ManageUsers />;
      case "analytics":
        return <Analytics />;
      case "login":
        return <h2>Please log in again</h2>; // placeholder for login page
      default:
        return <Stats />;
    }
  };

  return (
    <div>
      {/* Header */}
      <Header_login />

      <div className="admin-dashboard-container">
        {/* Sidebar */}
        <AdminSidebar setPage={setPage} />

        {/* Main Content */}
        <div className="admin-content">{renderPage()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
