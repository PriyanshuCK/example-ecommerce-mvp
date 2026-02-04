// Simple seed runner that uses Node.js directly
const { spawn } = require('child_process');
const path = require('path');

console.log('Running database seed...');

const seedProcess = spawn('npx', ['tsx', 'src/lib/db/seed.ts'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
  }
});

seedProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Seed process exited with code ${code}`);
    process.exit(1);
  } else {
    console.log('✅ Seed completed successfully!');
  }
});
