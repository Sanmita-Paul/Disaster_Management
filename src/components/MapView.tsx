interface MapPageProps {
  role: string;
}

const MapPage: React.FC<MapPageProps> = ({ role }) => {
  return (
    <div className="page-container">

      <h2>{role} Map</h2>

      <div className="map-placeholder">
        Map will be integrated here
      </div>

    </div>
  );
};

export default MapPage;