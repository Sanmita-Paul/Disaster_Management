const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});


// ================= AUTH ================= //

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role",
      [name, email, hashedPassword, role]
    );

    res.json({
      message: "Signup successful",
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.json({ message: "Invalid credentials" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= INCIDENTS ================= //

app.post("/api/incidents", async (req, res) => {
  const {
    user_id,
    description,
    disaster_type,
    severity,
    latitude,
    longitude
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO incident 
      (user_id, description, disaster_type, severity, latitude, longitude, status)
      VALUES ($1,$2,$3,$4,$5,$6,'pending')
      RETURNING *`,
      [user_id, description, disaster_type, severity, latitude, longitude]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating incident" });
  }
});

app.get("/api/incidents", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM incident ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching incidents" });
  }
});

app.get("/api/incidents/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM incident WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user incidents" });
  }
});


// ================= RESOURCES ================= //

app.post("/api/resources", async (req, res) => {
  const {
    ngo_id,
    resource_type,
    availability,
    quantity,
    latitude,
    longitude
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO resource 
      (ngo_id, resource_type, availability, quantity, latitude, longitude)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [ngo_id, resource_type, availability, quantity, latitude, longitude]
    );

    res.json({
      message: "Resource added successfully",
      resource: result.rows[0]
    });

  } catch (error) {
    console.error("RESOURCE INSERT ERROR:", error); // ✅ improved log
    res.status(500).json({ message: "Error adding resource" });
  }
});

app.get("/api/resources", async (req, res) => {
  const { type } = req.query;

  try {
    let query = `
      SELECT 
        resource.*, 
        users.name AS ngo_name
      FROM resource
      LEFT JOIN ngo ON resource.ngo_id = ngo.id
      LEFT JOIN users ON ngo.user_id = users.id
    `;

    let values = [];

    if (type) {
      query += " WHERE LOWER(resource.resource_type) = LOWER($1)";
      values.push(type);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching resources" });
  }
});

// ================= NGO ================= //

app.post("/ngo", async (req, res) => {
  const { user_id, latitude, longitude } = req.body;

  console.log("NGO DATA RECEIVED:", req.body);

  if (!user_id) {
    return res.status(400).json({ message: "User ID missing" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO ngo (user_id, latitude, longitude) VALUES ($1,$2,$3) RETURNING *",
      [user_id, latitude, longitude]
    );

    res.json({
      message: "NGO location saved",
      ngo: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving NGO" });
  }
});

app.get("/api/ngo/:user_id", async (req, res) => {
  const { user_id } = req.params;

  console.log("NGO FETCH CALLED WITH USER_ID:", user_id); // ✅ debug log

  try {
    const result = await pool.query(
      "SELECT id FROM ngo WHERE user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.json({
      ngo_id: result.rows[0].id
    });

  } catch (error) {
    console.error("NGO FETCH ERROR:", error); // ✅ improved log
    res.status(500).json({ message: "Error fetching NGO" });
  }
});


// ================= MAP ================= //

app.get("/api/map-data", async (req, res) => {
  const { role } = req.query;

  try {
    const incidents = await pool.query("SELECT * FROM incident");
   const resources = await pool.query(`
  SELECT 
    resource.*, 
    users.name AS ngo_name
  FROM resource
  LEFT JOIN ngo ON resource.ngo_id = ngo.id
  LEFT JOIN users ON ngo.user_id = users.id
`);

 const normalizedRole = (role || "").trim().toLowerCase();

let response = { incidents: [], resources: [] };

if (normalizedRole === "admin") {
  response.incidents = incidents.rows;
  response.resources = resources.rows;
}

else if (normalizedRole === "user") {
  response.resources = resources.rows;
}

else if (normalizedRole === "ngo") {
  response.incidents = incidents.rows;
  response.resources = resources.rows;
}

else if (normalizedRole === "volunteer") {
  response.incidents = incidents.rows;
}
    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching map data" });
  }
});


// ================= GLOBAL ERROR HANDLER ================= //

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ message: "Server crashed" });
});
app.get("/api/stats", async (req, res) => {
  try {
    const users = await pool.query("SELECT role FROM users");

    let totalUsers = 0;
    let totalVolunteers = 0;
    let totalNGOs = 0;

    users.rows.forEach((u) => {
      const role = (u.role || "").trim().toLowerCase();

      if (role === "user") totalUsers++;
      else if (role === "volunteer") totalVolunteers++;
      else if (role === "ngo") totalNGOs++;
    });

    res.json({
      totalUsers,
      totalVolunteers,
      totalNGOs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// ================= START ================= //

app.listen(5000, () => {
  console.log("Server running on port 5000");
});