const Stats: React.FC = () => {

  return (
    <div className="admin-page">

      <h2>Platform Overview</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">120</p>
        </div>

        <div className="stat-card">
          <h3>Total Volunteers</h3>
          <p className="stat-number">45</p>
        </div>

        <div className="stat-card">
          <h3>Total NGOs</h3>
          <p className="stat-number">12</p>
        </div>

      </div>

    </div>
  );
};

export default Stats; 