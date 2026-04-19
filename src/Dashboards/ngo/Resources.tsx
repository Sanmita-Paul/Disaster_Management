import { useState, useEffect } from "react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = ({ setLatLng }: any) => {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
    }
  });
  return null;
};

const Requests: React.FC = () => {
  const [type, setType] = useState("");
  const [availability, setAvailability] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [position, setPosition] = useState<any>(null);

  // ✅ NEW: NGO ID STATE
  const [ngoId, setNgoId] = useState<number | null>(null);

  // ✅ FETCH NGO ID USING USER ID
  useEffect(() => {
    const fetchNgo = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        alert("User not found");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/ngo/${user.id}`);
        const data = await res.json();

        if (data.ngo_id) {
          setNgoId(data.ngo_id);
        } else {
          alert("NGO not registered");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching NGO");
      }
    };

    fetchNgo();
  }, []);

  // 🔍 ADDRESS SEARCH
  const handleSearch = async (value: string) => {
    setSearch(value);

    if (value.length < 3) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  // 📍 SELECT ADDRESS
  const handleSelect = (place: any) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    setPosition({ lat, lng: lon });
    setSuggestions([]);
    setSearch(place.display_name);
  };

  // 📤 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ngoId) {
      alert("NGO ID not found");
      return;
    }

    if (!position) {
      alert("Please select location");
      return;
    }

    const res = await fetch("http://localhost:5000/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ngo_id: ngoId,
        resource_type: type,
        availability,
        quantity,
        latitude: position.lat,
        longitude: position.lng
      })
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alert("Resource Added!");
      setType("");
  setQuantity(0);
  setAvailability(true);
  setSearch("");
  setSuggestions([]);
  setPosition(null);
    } else {
      alert(data.message);
    }
  };

  return (
  <div className="page-container">
    <h2>Resource Form</h2>

    {/* ✅ FIX HERE */}
    <div className="card card-accent">

      <form onSubmit={handleSubmit}>

        <label>Select Resource Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="shelter">Shelter</option>
          <option value="food">Food</option>
          <option value="medical">Medical</option>
          <option value="water">Water</option>
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />

        <label>Availability:</label>
        <select
          value={availability ? "true" : "false"}
          onChange={(e) => setAvailability(e.target.value === "true")}
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Location..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => handleSelect(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        {/* MAP */}
        <MapContainer
          center={[26.85, 80.95]}
          zoom={13}
          style={{ height: "300px", marginTop: "10px" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationPicker setLatLng={setPosition} />

          {position && <Marker position={position} />}
        </MapContainer>

        <div className="request-actions">
          <button className="resource-submit-btn" type="submit">
            Submit Resource
          </button>
        </div>

      </form>
    </div>
  </div>
);
}
export default Requests;