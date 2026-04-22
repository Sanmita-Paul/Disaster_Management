import { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const [location, setLocation] = useState<any>(null);
  const [shelters, setShelters] = useState<any[]>([]);

  // 📍 GET USER LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        console.error(err);
        alert("Location access denied");
      }
    );
  }, []);

  // 📡 FETCH RESOURCES
  useEffect(() => {
    if (!location) return;

    const fetchShelters = async () => {
      const res = await fetch(
        "http://localhost:5000/api/resources?resource_type=shelter"
      );
      const data = await res.json();

      // 📏 DISTANCE CALCULATION (Haversine)
      const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      };

      // 🧠 ADD DISTANCE + SORT
      const sorted = data
        .map((r: any) => ({
          ...r,
          distance: getDistance(
            location.lat,
            location.lng,
            r.latitude,
            r.longitude
          )
        }))
        .sort((a: any, b: any) => a.distance - b.distance);

      setShelters(sorted);
    };

    fetchShelters();
  }, [location]);

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

          {shelters.length === 0 && <p>Loading shelters...</p>}

          {shelters.slice(0, 5).map((s, i) => (
            <div key={i} className="shelter-card">
              <h3>Shelter #{s.id}</h3>
              <p>NGO: {s.ngo_name}</p>
              <p>Type: {s.resource_type}</p>
              <p>Quantity: {s.quantity}</p>
              <p>Distance: {s.distance.toFixed(2)} km</p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default HomePage;