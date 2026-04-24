const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});


// ================= AUTH ================= //

app.post(
  "/signup",
  upload.fields([
    { name: "id_proof", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  async (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      name,
      email,
      password,
      role,
      age,
      gender,
      aadhaar_number, // ✅ fixed
      latitude,
      longitude
    } = req.body;

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
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1,$2,$3,$4) 
         RETURNING id,name,email,role`,
        [name, email, hashedPassword, role]
      );

      const userId = result.rows[0].id;

      // ✅ FIXED: store proper URLs
      const idProofPath = req.files?.id_proof
        ? `/uploads/${req.files.id_proof[0].filename}`
        : null;

      const imagePath = req.files?.image
        ? `/uploads/${req.files.image[0].filename}`
        : null;

      if (role === "volunteer") {
        await pool.query(
          `INSERT INTO volunteer 
          (user_id, age, gender, aadhaar_number, latitude, longitude, id_proof_url, image_url)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            userId,
            age,
            gender,
            aadhaar_number, // ✅ fixed
            latitude,
            longitude,
            idProofPath,
            imagePath
          ]
        );
      }

      res.json({
        message: "Signup successful",
        user: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


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
    const result = await pool.query(`
      SELECT 
        id,
        user_id,
        description,
        disaster_type,
        severity,
        latitude,
        longitude,
        status
      FROM incident
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching incidents" });
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
    console.error(error);
    res.status(500).json({ message: "Error adding resource" });
  }
});

app.get("/api/resources", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        resource.id,
        resource.ngo_id,
        resource.resource_type,
        resource.quantity,
        resource.availability,
        resource.latitude,
        resource.longitude,
        users.name AS ngo_name
      FROM resource
      LEFT JOIN ngo ON resource.ngo_id = ngo.id
      LEFT JOIN users ON ngo.user_id = users.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching resources" });
  }
});


// ================= NGO ================= //

app.post("/ngo", async (req, res) => {
  const { user_id, latitude, longitude } = req.body;

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


// ================= LOCATION UPDATE ================= //

app.post("/update-location", async (req, res) => {
  const { user_id, lat, lng } = req.body;

  console.log("UPDATE LOCATION:", req.body);

  try {
    await pool.query(
      `UPDATE volunteer 
       SET latitude = $1, longitude = $2 
       WHERE user_id = $3`,
      [lat, lng, user_id]
    );

    res.json({ message: "Location updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating location" });
  }
});


// ================= MAP ================= //

app.get("/api/map-data", async (req, res) => {
  const { role } = req.query;

  try {
    // ✅ INCIDENTS (EXPLICIT FIELDS)
    const incidents = await pool.query(`
      SELECT 
        id,
        user_id,
        description,
        disaster_type,
        severity,
        latitude,
        longitude,
        status
      FROM incident
    `);

    // ✅ RESOURCES (EXPLICIT FIELDS)
    const resources = await pool.query(`
      SELECT 
        resource.id,
        resource.ngo_id,
        resource.resource_type,
        resource.quantity,
        resource.availability,
        resource.latitude,
        resource.longitude,
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
  // volunteers should NOT see all incidents/resources blindly
  response.incidents = incidents.rows.filter(i => i.status !== "resolved");
  response.resources = resources.rows;
}

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching map data" });
  }
});

app.get("/api/ngos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ngo.id,
        users.name,
        ngo.latitude,
        ngo.longitude
      FROM ngo
      JOIN users ON ngo.user_id = users.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching NGOs" });
  }
});
app.get("/api/get-ngo/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id FROM ngo WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching NGO" });
  }
});

app.post("/api/apply-ngo", async (req, res) => {
  const { volunteerId, ngoId } = req.body;

  try {
    await pool.query(
      `INSERT INTO volunteer_applications (volunteer_id, ngo_id)
       VALUES ($1, $2)
       ON CONFLICT (volunteer_id, ngo_id) DO NOTHING`,
      [volunteerId, ngoId]
    );

    res.json({ message: "Applied successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying" });
  }
});

app.get("/api/ngo-applications/:ngoId", async (req, res) => {
  const { ngoId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        va.application_id,
        va.status,
        va.applied_at,

        v.age,
        v.gender,
        v.aadhaar_number,
        v.id_proof_url,
        v.image_url,

        u.name
      FROM volunteer_applications va
      JOIN volunteer v ON va.volunteer_id = v.id
      JOIN users u ON v.user_id = u.id
      WHERE va.ngo_id = $1
      ORDER BY va.applied_at DESC
    `, [ngoId]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching applications" });
  }
});

app.post("/api/update-application", async (req, res) => {
  const { applicationId, status } = req.body;

  try {
    // update application
    const result = await pool.query(
      `UPDATE volunteer_applications
       SET status = $1
       WHERE application_id = $2
       RETURNING volunteer_id, ngo_id`,
      [status, applicationId]
    );

    // ✅ NEW LOGIC
    if (status === "accepted") {
      const { volunteer_id, ngo_id } = result.rows[0];

      await pool.query(
        `UPDATE volunteer
         SET assigned_ngo_id = $1
         WHERE id = $2`,
        [ngo_id, volunteer_id]
      );
    }

    res.json({ message: "Status updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});
app.get("/api/get-volunteer/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id FROM volunteer WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching volunteer" });
  }
});
app.get("/api/volunteer-applications/:volunteerId", async (req, res) => {
  const { volunteerId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        va.application_id,
        va.status,
        va.applied_at,
        ngo.id as ngo_id,
        users.name as ngo_name
      FROM volunteer_applications va
      JOIN ngo ON va.ngo_id = ngo.id
      JOIN users ON ngo.user_id = users.id
      WHERE va.volunteer_id = $1
      ORDER BY va.applied_at DESC
    `, [volunteerId]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching applications" });
  }
});
app.post("/api/tasks", async (req, res) => {
  const { incident_id, ngo_id, description, priority } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks 
      (incident_id, ngo_id, description, priority, status)
      VALUES ($1,$2,$3,$4,'pending')
      RETURNING task_id, incident_id, ngo_id, description, priority, status`,
      [incident_id, ngo_id, description, priority]
    );

    res.json(result.rows[0]); // ✅ will include task_id
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
});


app.get("/api/available-volunteers/:ngoId", async (req, res) => {
  const ngoId = parseInt(req.params.ngoId); // ✅ force integer

  console.log("NGO ID RECEIVED:", ngoId);

  try {
    const result = await pool.query(`
      SELECT 
        v.id,
        u.name
      FROM volunteer v
      JOIN users u ON v.user_id = u.id
      JOIN volunteer_applications va ON va.volunteer_id = v.id
      WHERE va.ngo_id = $1
      AND va.status = 'accepted'
      AND v.availability = true
    `, [ngoId]);

    console.log("VOLUNTEERS FOUND:", result.rows);

    res.json(result.rows);

  } catch (err) {
    console.error("ERROR FETCHING VOLUNTEERS:", err);
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});

app.post("/api/assign-task", async (req, res) => {
  const { task_id, volunteer_ids } = req.body;

  try {
    for (let vid of volunteer_ids) {
      await pool.query(
        `INSERT INTO task_assignments 
        (task_id, volunteer_id, status)
        VALUES ($1,$2,'assigned')
        ON CONFLICT (task_id, volunteer_id) DO NOTHING`,
        [task_id, vid]
      );
    }

    res.json({ message: "Volunteers assigned" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning volunteers" });
  }
});
// ================= COMPLETE ASSIGNMENT ================= //

app.post(
  "/complete-assignment",
  upload.fields([
    { name: "report", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  async (req, res) => {

    const { assignment_id, remarks } = req.body;
    console.log("assignment_id:", assignment_id);

    try {

      // ✅ 1. CHECK ASSIGNMENT EXISTS + STATUS
      const incidentCheck = await pool.query(
        `SELECT * FROM task_assignments WHERE assignment_id = $1`,
        [assignment_id]
      );

      console.log("ASSIGNMENT CHECK:", incidentCheck.rows);

      if (incidentCheck.rows.length === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      if (incidentCheck.rows[0].status === "completed") {
        return res.json({ message: "Already completed" });
      }

      // file path
      const proof_url = req.files?.report
        ? `/uploads/${req.files.report[0].filename}`
        : null;

      // 2. save report
      await pool.query(
        `INSERT INTO reports (assignment_id, proof_url, remarks)
         VALUES ($1,$2,$3)`,
        [assignment_id, proof_url, remarks]
      );

      // 3. get incident id
      const result = await pool.query(`
        SELECT t.incident_id
        FROM task_assignments ta
        JOIN tasks t ON ta.task_id = t.task_id
        WHERE ta.assignment_id = $1
      `, [assignment_id]);

      if (result.rows.length > 0) {
        await pool.query(
          `UPDATE incident SET status = 'resolved' WHERE id = $1`,
          [result.rows[0].incident_id]
        );
      }

      // 4. get task_id
      const taskRes = await pool.query(
        `SELECT task_id FROM task_assignments WHERE assignment_id = $1`,
        [assignment_id]
      );

      if (taskRes.rows.length > 0) {
        const task_id = taskRes.rows[0].task_id;

        await pool.query(
          `UPDATE tasks SET status = 'completed' WHERE task_id = $1`,
          [task_id]
        );
      }

      // 5. update assignment
      await pool.query(
        `UPDATE task_assignments
         SET status = 'completed'
         WHERE assignment_id = $1`,
        [assignment_id]
      );

      res.json({ message: "Completed" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error" });
    }
  }
);
// ================= USER FULL STATUS ================= //

app.get("/api/user-full-status/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
  i.id as incident_id,
  i.description,
  i.disaster_type,
  i.status as incident_status,

  t.task_id,
  t.status as task_status,

  ta.assignment_id,
  ta.status as assignment_status,

  r.report_id

FROM incident i
LEFT JOIN tasks t ON i.id = t.incident_id
LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
LEFT JOIN reports r ON ta.assignment_id = r.assignment_id
WHERE i.user_id = $1
ORDER BY i.id DESC, ta.assignment_id DESC;
    `, [userId]);

    // 🔥 REMOVE DUPLICATES HERE (IMPORTANT)
   const map = new Map();

result.rows.forEach(row => {
  const id = row.incident_id;

  map.set(id, {
    incident_id: row.incident_id,
    description: row.description,
    disaster_type: row.disaster_type,
    incident_status: row.incident_status,
    task_status: row.task_status ?? "not assigned",
    assignment_status: row.assignment_status ?? "not assigned",
    report_id: row.report_id
  });
});

    res.json([...map.values()]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching full status" });
  }
});
// ================= MY TASKS (FIX) =================
app.get("/api/my-tasks/:volunteerId", async (req, res) => {
  const { volunteerId } = req.params;

  try {
    const result = await pool.query(`
  SELECT 
    ta.assignment_id,
    ta.status AS assignment_status,
    t.task_id,
    t.description,
    t.status AS task_status
  FROM task_assignments ta
  JOIN tasks t ON ta.task_id = t.task_id
  WHERE ta.volunteer_id = $1
  ORDER BY ta.assignment_id DESC
`, [volunteerId]);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});
// ================= STATS ================= //

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


// ================= ERROR HANDLER ================= //

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ message: "Server crashed" });
});


// ================= START ================= //

app.listen(5000, () => {
  console.log("Server running on port 5000");
});