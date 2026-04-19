import "./volunteer.css";

type Props = {
  setPage: (page: string) => void;
};

function Sidebar({ setPage }: Props) {

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="vol-sidebar">
      <h2 className="vol-sidebar-title">Volunteer Panel</h2>

      <button onClick={() => setPage("home")}>🏠 Home</button>
      <button onClick={() => setPage("tasks")}>📋 Tasks</button>
      <button onClick={() => setPage("apply")}>📝 Apply to NGO</button>
      <button onClick={() => setPage("status")}>📊 Application Status</button>
      <button onClick={() => setPage("alerts")}>🚨 Alerts</button>
      <button onClick={() => setPage("map")}>🗺️ Map</button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="vol-logout-btn"
        type="button"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar;