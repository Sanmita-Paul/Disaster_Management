import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface MapPageProps {
  role: string;
}

const toLatLng = (lat: number, lng: number): LatLngExpression => [lat, lng];
const SafeMapContainer: any = MapContainer;

// 🔴 INCIDENTS
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// 🟢 RESOURCES
const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// 🔵 NGO
const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapPage: React.FC<MapPageProps> = ({ role }) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/map-data?role=${role}`
        );
        const data = await res.json();

        console.log("MAP DATA:", data);

        setIncidents(data.incidents || []);
        setResources(data.resources || []);

        if (role === "Admin") {
  const ngoRes = await fetch("http://localhost:5000/api/ngos");
  const ngoData = await ngoRes.json();

  setNgos(
    ngoData.map((n: any) => ({
      id: n.id,
      lat: Number(n.latitude),
      lng: Number(n.longitude),
      name: n.name
    }))
  );
}
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [role]);

  return (
    <div className="page-container">
      <h2>{role} Map</h2>

      <SafeMapContainer
        center={toLatLng(28.6139, 77.2090)}
        zoom={11}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔴 INCIDENTS */}
        {(role === "Admin" || role === "NGO" || role === "Volunteer") &&
          incidents
            .filter(d => d.latitude !== null && d.longitude !== null)
            .map((d) => (
              <Marker
                key={`inc-${d.id}`}
                position={toLatLng(Number(d.latitude), Number(d.longitude))}
                icon={redIcon}
              >
                <Popup>
                  <b>{d.disaster_type}</b>
                  <br />
                  {d.description}
                  <br />
                  Severity: {d.severity}
                </Popup>
              </Marker>
            ))}

       {/* 🟢 RESOURCES */}
{(role === "Admin" || role === "NGO" || role === "User" || role === "Volunteer") &&
  resources
    .filter(r => r.latitude !== null && r.longitude !== null)
    .map((r) => (
      <Marker
        key={`res-${r.id}`}
        position={toLatLng(Number(r.latitude), Number(r.longitude))}
        icon={greenIcon}
      >
        <Popup>
          <b>{r.resource_type}</b>
          <br />
          NGO: {r.ngo_name || "Unknown"}
          <br />
          Quantity: {r.quantity}
          <br />
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${r.latitude},${r.longitude}`
              )
            }
          >
            Get Directions
          </button>
        </Popup>
      </Marker>
    ))}

        {/* 🔵 NGO */}
        {role === "Admin" &&
          ngos
            .filter(n => n.lat && n.lng)
            .map((n) => (
              <Marker
                key={`ngo-${n.id}`}
                position={toLatLng(n.lat, n.lng)}
                icon={blueIcon}
              >
                <Popup>NGO: {n.name}</Popup>
              </Marker>
            ))}
      </SafeMapContainer>
    </div>
  );
};

export default MapPage;