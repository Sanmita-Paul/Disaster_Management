const ManageUsers: React.FC = () => {

  const users = [
    { id: 1, name: "Rahul", role: "Volunteer" },
    { id: 2, name: "NGO Care", role: "NGO" }
  ];

  return (
    <div style={{ padding: "20px" }}>

      <h2>Manage Users</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li
            key={u.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px", 
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px"
            }}
          >
            <span>
              {u.name} ({u.role})
            </span>

            <div>
              <button
                style={{
                  marginRight: "8px",
                  backgroundColor: "#ffc107",
                  fontFamily: "work sans",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px", 
                  cursor: "pointer"
                }}
              >
                Block
              </button>

              <button
                style={{
                  backgroundColor: "#dc3545",
                  fontFamily: "work sans",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px", 
                  cursor: "pointer"
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;