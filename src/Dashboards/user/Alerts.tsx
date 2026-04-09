import { alerts } from "../../dummyData";

const Alerts: React.FC = () => {
  return (
    <div className="page-container">
      <h2>Alerts</h2>

      {alerts.map((a) => (
        <div key={a.id} className="alert-card">
          {a.message}
        </div>
      ))}
    </div>
  );
};

export default Alerts;