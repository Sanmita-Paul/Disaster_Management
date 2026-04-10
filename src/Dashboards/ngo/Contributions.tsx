const Contributions: React.FC = () => {

  const contributions = [
    { id:1, resource:"Food Kits", amount:100 },
    { id:2, resource:"Medical Kits", amount:50 }
  ];

  return (
    <div className="page-container">

      <h2>Track Contributions</h2>

      {contributions.map((c)=>(
        <div className="card" key={c.id}>
          <p><b>Resource:</b> {c.resource}</p>
          <p><b>Provided:</b> {c.amount}</p>
        </div>
      ))}

    </div>
  );
};

export default Contributions;