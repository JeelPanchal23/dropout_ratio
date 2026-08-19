const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

console.log('----------------------------------------------------');
console.log('🚀 Initializing EduShield AI Unified Production Server...');
console.log('----------------------------------------------------');

const projectRoot = __dirname;

function checkPort(port, callback) {
  const req = http.get(`http://localhost:${port}/api/health`, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
}

function startServices() {
  // 1. Unified Single-Port Backend & Frontend Server (Port 5000)
  checkPort(5000, (running) => {
    if (!running) {
      console.log('⚡ Starting Unified Express Server (Port 5000)...');
      spawn('node', ['server.js'], {
        cwd: path.join(projectRoot, 'backend'),
        shell: true,
        stdio: 'ignore'
      });
    } else {
      console.log('✅ Unified Express Server active on Port 5000.');
    }
  });

  // 2. Python ML Service (Port 8000)
  const pythonExec = path.join(projectRoot, 'ml-service', '.venv', 'Scripts', 'python.exe');
  spawn(pythonExec, ['-m', 'uvicorn', 'main:app', '--port', '8000'], {
    cwd: path.join(projectRoot, 'ml-service'),
    shell: true,
    stdio: 'ignore'
  });

  setTimeout(() => {
    console.log('\n====================================================');
    console.log('🌐 LOCAL ACCESS:');
    console.log('👉 http://localhost:5000');
    console.log('====================================================\n');

    console.log('🌐 Generating Public HTTPS Website Link for Everyone...');
    
    // Spawn localtunnel
    const ltCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const tunnel = spawn(ltCmd, ['localtunnel', '--port', '5000'], { shell: true });

    let linkFound = false;
    tunnel.stdout.on('data', (data) => {
      const output = data.toString();
      const match = output.match(/https:\/\/[^\s]+/);
      if (match && !linkFound) {
        linkFound = true;
        const publicUrl = match[0];
        console.log('\n====================================================');
        console.log('🎉 YOUR PUBLIC WEBSITE LINK (SHARE THIS WITH EVERYONE):');
        console.log(`👉 ${publicUrl}`);
        console.log('====================================================\n');
      }
    });

    tunnel.stderr.on('data', (data) => {
      // ignore verbose log
    });
  }, 2000);
}

startServices();

