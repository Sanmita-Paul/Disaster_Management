import { contacts } from "../../dummyData";
import "./dashboard.css";
const Contacts: React.FC = () => {
  return (
    <div className="contacts_page">
      <h2>Emergency Contacts</h2>

      {contacts.map((c) => (
        <div key={c.id} className="contact_card">
          <h3>{c.name}</h3>
          <p>{c.phone}</p>
        </div>
      ))}
    </div>
  );
};

export default Contacts;