import { disasters } from "../../dummyData";
import type { Disaster } from "../../types";

const Nearby: React.FC = () => {
  return (
    <div className="page-container">
      <h2>Nearby Disasters</h2>

      {disasters.map((d: Disaster) => (
        <div key={d.id} className="card">
          <h3>{d.title}</h3>
          <p>{d.location}</p>
        </div>
      ))}
    </div>
  );
};

export default Nearby;