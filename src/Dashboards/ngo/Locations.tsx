const Locations: React.FC = () => {

  const locations = [
    { id:1, place:"Mumbai Flood Zone" },
    { id:2, place:"Delhi Fire Area" },
    { id:3, place:"Kerala Landslide Region" }
  ];

  return (
    <div className="page-container">

      <h2>Locations Needing Support</h2>

      {locations.map((l)=>(
        <div className="card" key={l.id}>
          <p>{l.place}</p>
        </div>
      ))}

    </div>
  );
};

export default Locations;