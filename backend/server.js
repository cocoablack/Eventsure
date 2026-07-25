import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { validateEnvironment } from "./src/config/env.js";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 5000;

let server;

const shutdown = async (signal, exitCode = 0) => {
  console.log(`${signal} received; shutting down gracefully`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.connection.close().catch(() => undefined);
  process.exit(exitCode);
};

const startServer = async () => {
  validateEnvironment();
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`EventSure API listening on port ${PORT}`);
  });
};

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection", error);
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  shutdown("uncaughtException", 1);
});
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer().catch((error) => {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
});
