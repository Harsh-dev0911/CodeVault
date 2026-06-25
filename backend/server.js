if (!process.env.VERCEL) {
  const dns = require("dns");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const snippetRoutes = require("./routes/snippetRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://dixitadarsh549_db_user:5h3dm6xHWLTRXstn@cluster0.1ltbk65.mongodb.net/";

let dbConnectionPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose
      .connect(MONGO_URI)
      .then(() => mongoose.connection);
  }

  return dbConnectionPromise;
}

// Middleware
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes Setup
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);

// Serve Static Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Health Check (fallback)
app.get("/api/health", (req, res) => res.send("CodeVault API is running"));

if (require.main === module) {
  connectToDatabase()
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

module.exports = app;
