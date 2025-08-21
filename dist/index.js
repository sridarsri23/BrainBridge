#!/usr/bin/env node

// server/index.ts
import { spawn } from "child_process";
function startFastAPI() {
  console.log("\u{1F680} Starting BrainBridge FastAPI backend...");
  const initDb = spawn("python", ["init_db.py"], {
    cwd: process.cwd(),
    stdio: "inherit"
  });
  initDb.on("close", (code) => {
    if (code === 0) {
      console.log("\u2705 Database initialized successfully");
      const fastapi = spawn("python", ["run_fastapi.py"], {
        cwd: process.cwd(),
        stdio: "inherit"
      });
      fastapi.on("error", (err) => {
        console.error("\u274C Failed to start FastAPI server:", err);
        process.exit(1);
      });
      process.on("SIGINT", () => {
        console.log("\n\u{1F6D1} Shutting down FastAPI server...");
        fastapi.kill("SIGINT");
        process.exit(0);
      });
      process.on("SIGTERM", () => {
        fastapi.kill("SIGTERM");
        process.exit(0);
      });
    } else {
      console.error("\u274C Database initialization failed with code:", code);
      process.exit(1);
    }
  });
  initDb.on("error", (err) => {
    console.error("\u274C Failed to initialize database:", err);
    process.exit(1);
  });
}
startFastAPI();
