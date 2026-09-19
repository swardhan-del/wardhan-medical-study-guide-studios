// Test process only: never imported by the app and excluded from Vercel uploads.
import { createServer } from 'node:https';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
const directory = mkdtempSync(join(tmpdir(), 'wardhan-membership-test-'));
const cert = join(directory, 'cert.pem'); const key = join(directory, 'key.pem');
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert, '-days', '1', '-subj', '/CN=127.0.0.1', '-addext', 'subjectAltName=IP:127.0.0.1'], { stdio: 'ignore' });
const apiKey = 'synthetic-test-service-key-not-a-real-secret';
const server = createServer({ key: readFileSync(key), cert: readFileSync(cert) }, async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/v1/session/verify' || req.headers.authorization !== `Bearer ${apiKey}`) {
    res.writeHead(403); res.end(); return;
  }
  let body = ''; for await (const chunk of req) body += chunk;
  const token = JSON.parse(body).sessionToken;
  const name = token.replace(/-+$/, '');
  if (name === 'unavailable') { res.writeHead(503); res.end(); return; }
  if (name === 'timeout') { setTimeout(() => res.end(), 4000); return; }
  res.setHeader('Content-Type', 'application/json');
  if (!['basic', 'advanced', 'expired', 'revoked', 'past_due', 'ambiguous'].includes(name)) {
    res.end(JSON.stringify({ state: 'anonymous' })); return;
  }
  const now = Date.now();
  res.end(JSON.stringify({
    checkedAt: new Date(now).toISOString(),
    session: { userId: 'synthetic-user', expiresAt: new Date(now + 60000).toISOString() },
    membership: { userId: name === 'ambiguous' ? 'different-user' : 'synthetic-user',
      tier: name === 'advanced' ? 'advanced' : 'basic', status: ['revoked', 'past_due'].includes(name) ? name : 'active',
      validUntil: new Date(now + (name === 'expired' ? -1000 : 60000)).toISOString(),
      moduleIds: name === 'advanced' ? ['synthetic-foundation', 'synthetic-deeper'] : ['synthetic-foundation'],
    },
  }));
});
server.listen(3411, '127.0.0.1');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3103'], {
  stdio: 'inherit', env: { ...process.env, NODE_EXTRA_CA_CERTS: cert, MEMBERSHIP_VERIFIER_ORIGIN: 'https://127.0.0.1:3411', MEMBERSHIP_VERIFIER_API_KEY: apiKey, LOCAL_CURATION_REVIEW: '0', VERCEL: '' },
});
let closing = false;
function cleanup() { if (closing) return; closing = true; child.kill('SIGTERM'); server.close(); rmSync(directory, { recursive: true, force: true }); }
process.on('SIGTERM', () => { cleanup(); process.exit(0); });
process.on('SIGINT', () => { cleanup(); process.exit(0); });
child.on('exit', code => { cleanup(); process.exit(code ?? 1); });
