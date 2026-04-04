const test = require('node:test');
const assert = require('node:assert/strict');

const { registerSchema, loginSchema } = require('../utils/validators');
const { signTokens, verifyToken } = require('../utils/jwt');

test('registerSchema accepts a valid registration payload', () => {
  const { error, value } = registerSchema.validate({
    name: 'Test User',
    email: 'user@test.com',
    password: '123456',
    phone: '0123456789'
  });

  assert.equal(error, undefined);
  assert.equal(value.email, 'user@test.com');
});

test('loginSchema rejects missing password', () => {
  const { error } = loginSchema.validate({ email: 'user@test.com' });

  assert.ok(error);
  assert.match(error.message, /password/i);
});

test('signTokens and verifyToken preserve user identity and role', () => {
  const { accessToken, refreshToken } = signTokens('user-id-123', 'admin');
  const accessPayload = verifyToken(accessToken);
  const refreshPayload = verifyToken(refreshToken);

  assert.equal(accessPayload.userId, 'user-id-123');
  assert.equal(accessPayload.role, 'admin');
  assert.equal(refreshPayload.userId, 'user-id-123');
  assert.equal(refreshPayload.role, 'admin');
});
