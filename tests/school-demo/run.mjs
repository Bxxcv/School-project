// Bounded test harness: test the built files and the actual local preview API.
import { preview } from 'vite';
import { spawn } from 'node:child_process';
const server = await preview({preview: {port:0, host:'127.0.0.1', open:false}});
try {
  const port=server.httpServer.address().port;
  const test=spawn('python',['tests/school-demo/browser.py',`http://127.0.0.1:${port}`],{stdio:'inherit'});
  const timer=setTimeout(()=>test.kill('SIGTERM'),145000);
  const code=await new Promise(resolve=>test.on('close',resolve));
  clearTimeout(timer);process.exitCode=code===0?0:1;
} finally { await new Promise(resolve=>server.httpServer.close(resolve)); }
