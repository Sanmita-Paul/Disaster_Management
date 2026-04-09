// AdminSidebar.tsx
import React from "react";

interface Props {
  setPage: (page: string) => void;
}

const AdminSidebar: React.FC<Props> = ({ setPage }) => {
  const handleLogout = () => {
    // remove login info
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // optional, if you store role

    // redirect to homepage
    window.location.href = "/";
  };

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <button type="button" onClick={() => setPage("stats")}>Dashboard</button>
      <button type="button" onClick={() => setPage("reports")}>Disaster Reports</button>
      <button type="button" onClick={() => setPage("map")}>Map View</button>
      <button type="button" onClick={() => setPage("resources")}>Resources</button>
      <button type="button" onClick={() => setPage("users")}>Manage Users</button>
      <button type="button" onClick={() => setPage("analytics")}>Analytics</button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="logout-btn"
        type="button"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
