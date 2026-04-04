const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../schemas/User');
const Product = require('../schemas/Product');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const { sanitizeUser, pickAllowedFields } = require('../utils/response');

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

test('sanitizeUser removes password from user payloads', () => {
  const result = sanitizeUser({ name: 'User', password: 'secret', email: 'user@test.com' });

  assert.equal(result.password, undefined);
  assert.equal(result.email, 'user@test.com');
});

test('pickAllowedFields keeps only supported keys', () => {
  const result = pickAllowedFields(
    { name: 'A', phone: '0123', role: 'admin', isBanned: true },
    ['name', 'phone']
  );

  assert.deepEqual(result, { name: 'A', phone: '0123' });
});

test('updateProfile only forwards safe fields and strips password from response', async () => {
  const originalFindByIdAndUpdate = User.findByIdAndUpdate;

  User.findByIdAndUpdate = (id, updates) => {
    assert.equal(id, 'user-1');
    assert.deepEqual(updates, { name: 'Updated Name', phone: '0123456789' });

    return {
      populate: async () => ({
        _id: 'user-1',
        name: 'Updated Name',
        phone: '0123456789',
        password: 'hashed-password'
      })
    };
  };

  const req = {
    user: { id: 'user-1' },
    body: {
      name: 'Updated Name',
      phone: '0123456789',
      role: 'admin',
      password: 'new-password'
    }
  };
  const res = createRes();

  try {
    await userController.updateProfile(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.data.password, undefined);
    assert.equal(res.payload.data.name, 'Updated Name');
  } finally {
    User.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});

test('updateProduct only forwards editable fields', async () => {
  const originalFindOneAndUpdate = Product.findOneAndUpdate;

  Product.findOneAndUpdate = (query, updates) => {
    assert.deepEqual(query, { _id: 'product-1', seller: 'user-1' });
    assert.deepEqual(updates, { title: 'New title', isSold: true });

    return {
      populate: async () => ({
        _id: 'product-1',
        title: 'New title',
        isSold: true,
        isBoosted: false,
        seller: 'user-1'
      })
    };
  };

  const req = {
    params: { id: 'product-1' },
    user: { id: 'user-1' },
    body: {
      title: 'New title',
      seller: 'user-2',
      isBoosted: true,
      favoritesCount: 999,
      isSold: true
    }
  };
  const res = createRes();

  try {
    await productController.updateProduct[1](req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.data.isBoosted, false);
    assert.equal(res.payload.data.title, 'New title');
  } finally {
    Product.findOneAndUpdate = originalFindOneAndUpdate;
  }
});
