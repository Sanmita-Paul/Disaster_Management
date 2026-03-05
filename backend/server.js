const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: "postgresql://postgres:postgres2026@db.werpkrzqfrlpjruylwvz.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Login Route
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

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ message: "Login successful" });
    } else {
      res.json({ message: "Invalid credentials" });
    }

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signup Route
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

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, role]
    );

    res.json({ message: "Signup successful" });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});