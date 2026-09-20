import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverEntry = path.join(root, 'server', 'index.mjs');
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');

const common = {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env }
};

const backend = spawn(process.execPath, [serverEntry], {
  ...common,
  env: { ...common.env, PORT: '8787' }
});

const frontend = spawn(process.execPath, [viteBin, '--host', '127.0.0.1'], common);

let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  try { backend.kill(); } catch {}
  try { frontend.kill(); } catch {}

  setTimeout(() => process.exit(code), 100);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

backend.on('error', (err) => {
  console.error('Backend failed to start:', err);
  shutdown(1);
});

frontend.on('error', (err) => {
  console.error('Frontend failed to start:', err);
  shutdown(1);
});

backend.on('exit', (code) => {
  if (!shuttingDown && code !== 0) {
    console.error(`Backend exited with code ${code}`);
    shutdown(code ?? 1);
  }
});

frontend.on('exit', (code) => {
  if (!shuttingDown && code !== 0) {
    console.error(`Frontend exited with code ${code}`);
    shutdown(code ?? 1);
  }
});
