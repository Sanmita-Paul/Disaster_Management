
const Resources: React.FC = () => {

  const resources = [
    { id:1, type:"Food", quantity:200 },
    { id:2, type:"Medical Kits", quantity:80 },
    { id:3, type:"Shelter Beds", quantity:120 }
  ];

  return (
    <div className="page-container">

      <h2>Resource Requests</h2>

      {resources.map((r)=>(
        <div className="card" key={r.id}>
          <p><b>Type:</b> {r.type}</p>
          <p><b>Quantity Needed:</b> {r.quantity}</p>
          <div className="request-actions">
  <button className="accept-btn">Accept</button>
  <button className="reject-btn">Reject</button>
</div>
        </div>
      ))}

    </div>
  );
};

export default Resources;