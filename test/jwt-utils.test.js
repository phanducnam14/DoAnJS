const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../schemas/User');
const { protect, authorize, signTokens } = require('../utils/jwt');

const createRes = () => ({
  statusCode: 200,
  payload: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  }
});

test('protect rejects banned users even with valid token', async () => {
  const originalFindById = User.findById;
  const { accessToken } = signTokens('507f1f77bcf86cd799439011', 'admin');

  User.findById = () => ({
    select() {
      return this;
    },
    populate: async () => ({ _id: '507f1f77bcf86cd799439011', isBanned: true, role: { name: 'admin' } })
  });

  const req = {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  };
  const res = createRes();

  try {
    await protect(req, res, () => {
      throw new Error('next should not be called for banned users');
    });

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.payload, { message: 'Account banned' });
  } finally {
    User.findById = originalFindById;
  }
});

test('authorize uses database role over stale token role', () => {
  const req = {
    authRole: 'admin',
    user: {
      role: { name: 'user' }
    }
  };
  const res = createRes();

  authorize('admin')(req, res, () => {
    throw new Error('next should not be called when database role is user');
  });

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.payload, { message: 'Access denied' });
});
