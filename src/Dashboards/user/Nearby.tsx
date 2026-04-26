import { useEffect, useState } from "react";

const Nearby: React.FC = () => {
  const [location, setLocation] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);

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

  // 📡 FETCH INCIDENTS + CALCULATE DISTANCE
  useEffect(() => {
    if (!location) return;

    const fetchIncidents = async () => {
      const res = await fetch("http://localhost:5000/api/incidents");
      const data = await res.json();

      console.log("INCIDENTS:", data); // 🔍 debug

      // 📏 HAVERSINE DISTANCE
      const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      };

      // 🧠 ADD DISTANCE + SORT
      const sorted = data
        .map((d: any) => ({
          ...d,
          distance: getDistance(
            location.lat,
            location.lng,
            d.latitude,
            d.longitude
          )
        }))
        .sort((a: any, b: any) => a.distance - b.distance);

      setIncidents(sorted);
    };

    fetchIncidents();
  }, [location]);

  return (
    <div className="nearby_page">
      <h2>Nearby Disasters</h2>

      {incidents.length === 0 && <p>Loading disasters...</p>}

      {incidents.slice(0, 5).map((d, i) => (
        <div key={i} className="nearby_card">
          <h3>{d.disaster_type || "Disaster"}</h3>
          <p>{d.description}</p>
          <p>
  Severity:{" "}
  <span className={
    d.severity === "low"
      ? "severity_low"
      : d.severity === "medium"
      ? "severity_medium"
      : "severity_high"
  }>
    {d.severity}
  </span>
</p>

<p>
  Distance:{" "}
  <span className="nearby_distance">
    {d.distance.toFixed(2)} km
  </span>
</p>
        </div>
      ))}
    </div>
  );
};

export default Nearby;