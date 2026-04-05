const test = require('node:test');
const assert = require('node:assert/strict');

const createApp = require('../app');
const { request } = require('../support/http');

test('GET /api/health returns an app-level smoke response without DB', async () => {
  const app = createApp();
  const response = await request(app, { path: '/api/health' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json, {
    success: true,
    data: { status: 'ok' }
  });
});

test('POST /api/auth/register rejects invalid payload before hitting DB logic', async () => {
  const app = createApp();
  const response = await request(app, {
    method: 'POST',
    path: '/api/auth/register',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'not-an-email',
      password: '123'
    })
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.json.message, /required|valid email|length/i);
});

test('invalid JSON payload returns a stable 400 response', async () => {
  const app = createApp();
  const response = await request(app, {
    method: 'POST',
    path: '/api/auth/login',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"email":'
  });

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.json, { message: 'Invalid JSON payload' });
});

test('unknown route returns JSON 404', async () => {
  const app = createApp();
  const response = await request(app, { path: '/api/does-not-exist' });

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.json, { message: 'Not Found' });
});
