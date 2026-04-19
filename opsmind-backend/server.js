const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Opsmind Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);


const { protect, adminOnly } = require("./middleware/authmiddleware");

app.get("/api/test", protect, (req, res) => {
  res.json({ msg: "Protected route working", user: req.user });
});

app.get("/api/admin", protect, adminOnly, (req, res) => {
  res.json({ msg: "Admin route working" });
});


const sopRoutes = require("./routes/sopRoutes");

app.use("/api/sop", sopRoutes);

const askRoutes = require("./routes/askRoutes");

app.use("/api/ask", askRoutes);


app.use(cors({ origin: "http://localhost:3000", credentials: true }));