const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      
      {/* Welcome Header */}
      <div className="welcome-box">
        <h1>Welcome to Disaster Management Dashboard</h1>
        <p>
          This platform helps you report incidents, view alerts,
          and find nearby shelters during emergencies.
        </p>
      </div>

      {/* Shelter Information */}
      <div className="shelter-box">
        <h2>🏠 Nearby Emergency Shelters</h2>

        <div className="shelter-list">

          <div className="shelter-card">
            <h3>Community Hall Shelter</h3>
            <p>Capacity: 150 people</p>
            <p>Distance: 1.2 km</p>
          </div>

          <div className="shelter-card">
            <h3>City School Shelter</h3>
            <p>Capacity: 200 people</p>
            <p>Distance: 2.1 km</p>
          </div>

          <div className="shelter-card">
            <h3>Central Stadium Shelter</h3>
            <p>Capacity: 500 people</p>
            <p>Distance: 3.5 km</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HomePage;