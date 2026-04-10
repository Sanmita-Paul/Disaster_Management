const Requests: React.FC = () => {

  const requests = [
    { id: 1, disaster: "Flood", location: "Assam", status: "Pending" },
    { id: 2, disaster: "Fire", location: "Delhi", status: "Pending" }
  ];

  return (
    <div className="page-container">

      <h2>Disaster Requests</h2>

      {requests.map((r) => (
        <div className="card" key={r.id}>
          <p><b>Disaster:</b> {r.disaster}</p>
          <p><b>Location:</b> {r.location}</p>
          <div className="request-actions">
  <button className="accept-btn">Accept</button>
  <button className="reject-btn">Reject</button>
</div>
        </div>
      ))}

    </div>
  );
};

export default Requests;