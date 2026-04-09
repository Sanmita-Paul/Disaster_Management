import { disasters } from "../../dummyData";

const Status: React.FC = () => {
  return (
    <div className="page-container">
      <h2>Your Reports</h2>

      {disasters.map((d) => (
        <div key={d.id} className="card">
          <h3>{d.title}</h3>
          <p>Status: {d.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Status;