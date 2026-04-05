const test = require('node:test');
const assert = require('node:assert/strict');

const createApp = require('../app');
const User = require('../schemas/User');
const { request } = require('../support/http');
const { signTokens } = require('../utils/jwt');

test('GET /api/admin/dashboard rejects unauthenticated requests', async () => {
  const app = createApp();
  const response = await request(app, { path: '/api/admin/dashboard' });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.json, { message: 'Not authorized' });
});

test('GET /api/admin/dashboard rejects authenticated non-admin users', async () => {
  const originalFindById = User.findById;
  const { accessToken } = signTokens('user-1', 'user');

  User.findById = () => ({
    select() {
      return this;
    },
    populate: async () => ({ _id: 'user-1', role: { name: 'user' }, isBanned: false })
  });

  try {
    const app = createApp();
    const response = await request(app, {
      path: '/api/admin/dashboard',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    assert.equal(response.statusCode, 403);
    assert.deepEqual(response.json, { message: 'Access denied' });
  } finally {
    User.findById = originalFindById;
  }
});
