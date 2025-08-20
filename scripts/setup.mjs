#!/usr/bin/env node
// Cross-platform local setup for BrainBridge
// - Installs Node deps (npm ci)
// - Creates Python venv and installs deps
// - Starts PostgreSQL via Docker if available (brainbridge-postgres)
// - Creates .env if missing
// - Builds frontend
// - Initializes DB tables
// - Starts FastAPI backend

import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { Socket } from 'node:net';
import { resolve } from 'node:path';

const isWin = process.platform === 'win32';
const root = resolve(process.cwd());

function run(cmd, args, options = {}) {
  // Use shell: true on Windows to resolve npm from PATH
  const spawnOptions = isWin ? { ...options, shell: true } : { ...options, shell: false };
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...spawnOptions });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')} (exit code: ${res.status})`);
  }
}

function runWithFallback(cmd, args, fallbackCmd, fallbackArgs, options = {}) {
  console.log(`Trying: ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { stdio: 'ignore', shell: false, ...options });
  if (res.status === 0) return;
  console.log(`Fallback: ${fallbackCmd} ${fallbackArgs.join(' ')}`);
  run(fallbackCmd, fallbackArgs, options);
}

function tryRun(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, { stdio: 'ignore', shell: false, ...options });
  return res.status === 0;
}

function which(cmd) {
  // naive check: try running --version
  return tryRun(cmd, ['--version']);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForTcp(host, port, timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const ok = await new Promise((resolveOk) => {
      const client = new Socket();
      client.once('connect', () => {
        client.destroy();
        resolveOk(true);
      });
      client.once('error', () => {
        resolveOk(false);
      });
      client.connect(port, host);
    });
    if (ok) return true;
    await sleep(500);
  }
  return false;
}

function ensureEnvFile() {
  const envPath = resolve(root, '.env');
  if (existsSync(envPath)) return;
  const content = [
    'DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/brainbridge',
    `SECRET_KEY=${Math.random().toString(36).slice(2)}_${Date.now()}`,
    'PORT=5000',
    '',
  ].join('\n');
  writeFileSync(envPath, content, { encoding: 'utf8' });
  console.log('Created .env with default settings');
}

function venvPaths() {
  const venvDir = resolve(root, '.venv');
  const python = isWin ? resolve(venvDir, 'Scripts', 'python.exe') : resolve(venvDir, 'bin', 'python');
  const pip = isWin ? resolve(venvDir, 'Scripts', 'pip.exe') : resolve(venvDir, 'bin', 'pip');
  return { venvDir, python, pip };
}

function ensurePythonVenvAndDeps() {
  const { venvDir, python, pip } = venvPaths();
  if (!existsSync(venvDir)) {
    console.log('Creating Python venv...');
    run('python', ['-m', 'venv', venvDir]);
  }
  console.log('Installing Python dependencies...');
  const pkgs = [
    'alembic', 'bcrypt==4.0.1', 'email-validator', 'fastapi',
    'psycopg2-binary', 'pydantic', 'pydantic-settings', 'python-dotenv',
    'python-jose', 'python-multipart', 'sqlalchemy', 'uvicorn', 'passlib[bcrypt]'
  ];
  
  // Use the full path to pip directly
  const res = spawnSync(pip, ['install', '-U', ...pkgs], { stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error(`pip install failed (exit code: ${res.status})`);
  }
}

async function ensurePostgresDocker() {
  if (!which('docker')) {
    console.log('Docker not found; skipping Dockerized PostgreSQL. Ensure a local PostgreSQL is running.');
    return;
  }
  const name = 'brainbridge-postgres';
  // Check if container exists
  const exists = spawnSync('docker', ['ps', '-a', '--format', '{{.Names}}'], { encoding: 'utf8' });
  const list = (exists.stdout || '').split(/\r?\n/).filter(Boolean);
  if (!list.includes(name)) {
    console.log('Creating postgres container via Docker...');
    run('docker', ['run', '--name', name, '-e', 'POSTGRES_USER=postgres', '-e', 'POSTGRES_PASSWORD=postgres', '-e', 'POSTGRES_DB=brainbridge', '-p', '5432:5432', '-d', 'postgres:16']);
  } else {
    console.log('Starting existing postgres container...');
    run('docker', ['start', name]);
  }
  console.log('Waiting for PostgreSQL (localhost:5432)...');
  const up = await waitForTcp('127.0.0.1', 5432, 30000);
  if (!up) {
    console.warn('PostgreSQL did not become ready on port 5432. Setup will continue, but the backend may fail to start.');
  }
}

async function main() {
  console.log('== BrainBridge local setup ==');

  // 1) Ensure .env
  ensureEnvFile();

  // 2) Node deps
  console.log('Installing Node dependencies (npm ci)...');
  try {
    run('npm', ['ci']);
  } catch (err) {
    console.log('npm ci failed, trying npm install...');
    run('npm', ['install']);
  }

  // 3) Python venv + deps
  ensurePythonVenvAndDeps();

  // 4) Postgres (Docker, if available) – skip if port already open
  if (await waitForTcp('127.0.0.1', 5432, 1000)) {
    console.log('PostgreSQL detected on localhost:5432 – skipping Docker setup.');
  } else {
    await ensurePostgresDocker();
  }

  // 5) Build frontend
  console.log('Building frontend (npm run build)...');
  run('npm', ['run', 'build']);

  // 6) Initialize DB tables
  console.log('Initializing database tables...');
  const { python } = venvPaths();
  // Use the full path to Python directly
  const res = spawnSync(python, [resolve(root, 'init_db.py')], { stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error(`Database initialization failed (exit code: ${res.status})`);
  }

  // 7) Start backend
  console.log('\nStarting backend (FastAPI)...\n');
  const res2 = spawnSync(python, [resolve(root, 'run_fastapi.py')], { stdio: 'inherit' });
  if (res2.status !== 0) {
    throw new Error(`FastAPI startup failed (exit code: ${res2.status})`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});


