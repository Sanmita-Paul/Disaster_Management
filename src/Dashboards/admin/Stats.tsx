import React, { useEffect, useState } from "react";

const Stats: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolunteers: 0,
    totalNGOs: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats");
        const data = await res.json();

        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <h2>Platform Overview</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Volunteers</h3>
          <p className="stat-number">{stats.totalVolunteers}</p>
        </div>

        <div className="stat-card">
          <h3>Total NGOs</h3>
          <p className="stat-number">{stats.totalNGOs}</p>
        </div>

      </div>
    </div>
  );
};

export default Stats;