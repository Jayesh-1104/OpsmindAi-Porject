const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("OpsMind Backend Running"));

// Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/sop", require("./routes/sopRoutes"));
app.use("/api/ask", require("./routes/askRoutes"));

// Protected test routes
const { protect, adminOnly } = require("./middleware/authmiddleware");
app.get("/api/test", protect, (req, res) => res.json({ msg: "Protected route working", user: req.user }));
app.get("/api/admin", protect, adminOnly, (req, res) => res.json({ msg: "Admin route working" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
