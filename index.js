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

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Stripe webhook must stay before express.json()
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

let firebaseInitialized = false;

const ensureServices = async (req, res, next) => {
  try {
    await connectDB();

    if (!firebaseInitialized) {
      initializeFirebase();
      firebaseInitialized = true;
    }

    next();
  } catch (error) {
    next(error);
  }
};

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Life Lessons AI — API is running 🚀",
  });
});

app.use("/api", ensureServices, routes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    if (!firebaseInitialized) {
      initializeFirebase();
      firebaseInitialized = true;
    }

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

if (require.main === module) {
  startServer();
}

module.exports = app;