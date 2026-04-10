import React from "react";

interface SidebarProps {
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
  const handleLogout = () => {
    localStorage.removeItem("role"); // remove login role
    window.location.href = "/";       // redirect to home/login page
  };

  return (
    <div className="vol-sidebar">
      <h2 className="vol-sidebar-title">Volunteer Panel</h2>

      <button type="button" onClick={() => setActivePage("home")}>🏠 Home</button>
      <button type="button" onClick={() => setActivePage("alerts")}>🚨 Alerts</button>
      <button type="button" onClick={() => setActivePage("nearby")}>📍 Nearby</button>

      {/* NEW MAP BUTTON */}
      <button type="button" onClick={() => setActivePage("map")}>🗺️ Map</button>

      <button type="button" onClick={() => setActivePage("status")}>📋 Status</button>
      <button type="button" onClick={() => setActivePage("contacts")}>📞 Contacts</button>

      {/* Logout button */}
      <button type="button" className="vol-logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;