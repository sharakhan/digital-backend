require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const { initializeFirebase } = require("./src/config/firebase");
const routes = require("./src/routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middlewares/errorHandler");

// ─── App Initialization ────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ────────────────────────────────────────
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ─── Global Middlewares ─────────────────────────────────────────
app.use(cors(corsOptions));

// Stripe webhook needs raw body for signature verification — must come BEFORE express.json()
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ─────────────────────────────────────────────────
app.use("/api", routes);

// ─── Root Endpoint ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Life Lessons AI — API is running 🚀",
  });
});

// ─── Error Handling ─────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Server Startup ─────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Firebase Admin SDK (non-blocking — warns if key is missing)
    initializeFirebase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
