import "./ngoSetup.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function NgoHeader(){
  return(
    <div className='ngo-head'>
      <img src="/logo.png" alt="logo" className="ngo-logo" />
      <h1>Disaster Management</h1>
    </div>
  )
}

// 📍 Handle map click
function LocationPicker({ setLatLng }: any) {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    },
  });
  return null;
}

export function NgoSetup(){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [position, setPosition] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ ADD THIS (sets role to NGO always on this page)
  useEffect(() => {
    localStorage.setItem("role", "ngo");
  }, []);

  // 📍 GPS location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("Unable to fetch location");
      }
    );
  };

  // 🚀 Submit
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!position) {
      alert("Please select location on map or use GPS");
      return;
    }

    try {
      setLoading(true);

      await fetch("http://localhost:5000/ngo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          latitude: position.lat,
          longitude: position.lng,
        }),
      });

      alert("Location saved successfully");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Error saving location");
    }

    setLoading(false);
  };

  return(
    <div className="ngo-setup-body">
      <NgoHeader />

      <div className="ngo-setup-container">
        <div className="ngo-setup-box">

          <h2>Select NGO Location</h2>

          {/* 📍 GPS Button */}
          <button 
            className="ngo-location-btn"
            onClick={getLocation}
          >
            📍 Use Current Location
          </button>

          {/* 🗺️ MAP */}
          <div className="ngo-map">
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker setLatLng={setPosition} />

              {position && (
                <Marker position={position}></Marker>
              )}
            </MapContainer>
          </div>

          <form onSubmit={handleSubmit}>
            <button 
              className="ngo-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}