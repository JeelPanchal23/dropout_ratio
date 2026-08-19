const { spawn, exec } = require('child_process');
const path = require('path');

console.log('----------------------------------------------------');
console.log('🚀 Starting EduShield AI Platform Services...');
console.log('----------------------------------------------------');

const projectRoot = __dirname;

// 1. Backend Server (Port 5000)
const backend = spawn('node', ['server.js'], {
  cwd: path.join(projectRoot, 'backend'),
  shell: true,
  stdio: 'inherit'
});

// 2. Python ML Service (Port 8000)
const pythonExec = path.join(projectRoot, 'ml-service', '.venv', 'Scripts', 'python.exe');
const mlService = spawn(pythonExec, ['-m', 'uvicorn', 'main:app', '--port', '8000'], {
  cwd: path.join(projectRoot, 'ml-service'),
  shell: true,
  stdio: 'inherit'
});

// 3. React Frontend Dev Server (Port 3000)
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(projectRoot, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

console.log('✅ Services initiated.');
console.log('➜ Express Backend: http://localhost:5000');
console.log('➜ Python ML Service: http://localhost:8000');
console.log('➜ React Frontend: http://localhost:3000');

// Automatically launch default browser / Chrome to http://localhost:3000/
setTimeout(() => {
  console.log('🌐 Opening EduShield AI in your browser...');
  const startCmd = process.platform === 'win32' ? 'start http://localhost:3000/' : 'open http://localhost:3000/';
  exec(startCmd);
}, 2000);
