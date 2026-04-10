interface SidebarProps {
  setPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setPage }) => {

  const handleLogout = () => {
    localStorage.removeItem("role"); // remove login role
    window.location.href = "/"; // redirect to login/home page
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">User Panel</h2>

      <button type="button" onClick={() => setPage("home")}>🏠 Home</button>
      <button type="button" onClick={() => setPage("report")}>➕ Report</button>
      <button type="button" onClick={() => setPage("nearby")}>📍 Nearby</button>
      <button type="button" onClick={() => setPage("alerts")}>📢 Alerts</button>
      <button type="button" onClick={() => setPage("status")}>📄 Status</button>
      <button type="button" onClick={() => setPage("contacts")}>📞 Contacts</button>
      <button type="button" onClick={() => setPage("map")}>🗺️ Map</button>

      <button type="button" className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;