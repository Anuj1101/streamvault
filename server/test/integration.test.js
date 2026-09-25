process.env.NODE_ENV = 'test';
import http from 'http';
import app from '../server.js';

let server;
const PORT = 5099;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(resBody) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: resBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

async function run() {
  server = app.listen(PORT);
  console.log(`Test server running on port ${PORT}...`);

  try {
    // 1. Health check
    const health = await request('GET', '/api/media/health');
    assert(health.status === 200, `Health status should be 200, got ${health.status}`);
    assert(health.data.status === 'ok', 'Health status should be ok');
    console.log('✓ Health check passed');

    // 2. Reject empty URL
    const emptyRes = await request('POST', '/api/media/analyze', { url: '' });
    assert(emptyRes.status === 400, 'Empty URL should return 400');
    console.log('✓ Empty URL rejection passed');

    // 3. Reject SSRF / Invalid domain
    const ssrfRes = await request('POST', '/api/media/analyze', { url: 'https://attacker.com/malicious' });
    assert(ssrfRes.status === 400, 'Non-YouTube host should return 400');
    assert(ssrfRes.data.error.includes('Only official YouTube URLs are accepted'), 'Error message mismatch');
    console.log('✓ SSRF rejection passed');

    // 4. Reject invalid options
    const optRes = await request('POST', '/api/media/download', { url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', format: 'exe', quality: '720p' });
    assert(optRes.status === 400, 'Invalid format should return 400');
    console.log('✓ Invalid format rejection passed');

    console.log('All backend integration tests passed successfully!');
  } finally {
    if (server) {
      server.close(() => {
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }
}

run().catch((err) => {
  console.error('Integration test failed:', err);
  if (server) server.close();
  process.exit(1);
});
