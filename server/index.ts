#!/usr/bin/env node
/**
 * Bridge script to start the Python FastAPI backend
 * This allows the existing npm run dev workflow to work with the migrated Python backend
 */

import { spawn } from 'child_process';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

function startFastAPI() {
  console.log('🚀 Starting BrainBridge FastAPI backend...');
  
  // Initialize database first
  const initDb = spawn('python', ['init_db.py'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  initDb.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Database initialized successfully');
      
      // Start FastAPI server
      const fastapi = spawn('python', ['run_fastapi.py'], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });

      fastapi.on('error', (err) => {
        console.error('❌ Failed to start FastAPI server:', err);
        process.exit(1);
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down FastAPI server...');
        fastapi.kill('SIGINT');
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        fastapi.kill('SIGTERM');
        process.exit(0);
      });
      
    } else {
      console.error('❌ Database initialization failed with code:', code);
      process.exit(1);
    }
  });

  initDb.on('error', (err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
}

// Start the FastAPI backend
startFastAPI();
