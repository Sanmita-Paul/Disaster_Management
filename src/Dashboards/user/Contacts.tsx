import { contacts } from "../../dummyData";

const Contacts: React.FC = () => {
  return (
    <div className="page-container">
      <h2>Emergency Contacts</h2>

      {contacts.map((c) => (
        <div key={c.id} className="card">
          <h3>{c.name}</h3>
          <p>{c.phone}</p>
        </div>
      ))}
    </div>
  );
};

export default Contacts;