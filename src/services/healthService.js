const mongoose = require("mongoose");

/**
 * Returns the current server health status including
 * uptime, timestamp, and MongoDB connection state.
 */
const checkHealth = () => {
  const mongoStates = ["disconnected", "connected", "connecting", "disconnecting"];

  return {
    status: "OK",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    mongodb: mongoStates[mongoose.connection.readyState] || "unknown",
    environment: process.env.NODE_ENV || "development",
  };
};

module.exports = { checkHealth };
