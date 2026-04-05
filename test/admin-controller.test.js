const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../schemas/User');
const Role = require('../schemas/Role');
const Product = require('../schemas/Product');
const AdminActivity = require('../schemas/AdminActivity');
const adminController = require('../controllers/adminController');

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

test('updateUserRole changes role and logs admin activity', async () => {
  const originalRoleFindOne = Role.findOne;
  const originalUserFindById = User.findById;
  const originalActivityCreate = AdminActivity.create;

  const savedUser = {
    _id: 'user-2',
    name: 'Target User',
    email: 'target@test.com',
    role: { _id: 'role-user', name: 'user' },
    isBanned: false,
    async save() {
      this.role = 'role-admin';
    },
    async populate() {
      this.role = { _id: 'role-admin', name: 'admin' };
      return this;
    }
  };

  let createdActivity = null;

  Role.findOne = async ({ name }) => ({ _id: `role-${name}`, name });
  User.findById = () => ({
    populate: async () => savedUser
  });
  AdminActivity.create = async (payload) => {
    createdActivity = payload;
    return payload;
  };

  const req = {
    user: { id: '507f1f77bcf86cd799439012' },
    params: { id: '507f1f77bcf86cd799439011' },
    body: { role: 'admin' }
  };
  const res = createRes();

  try {
    await adminController.updateUserRole(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.data.role, 'admin');
    assert.deepEqual(createdActivity, {
      admin: '507f1f77bcf86cd799439012',
      action: 'update_user_role',
      targetType: 'user',
      targetId: 'user-2',
      details: { role: 'admin' }
    });
  } finally {
    Role.findOne = originalRoleFindOne;
    User.findById = originalUserFindById;
    AdminActivity.create = originalActivityCreate;
  }
});

test('approveProduct marks product approved and logs admin activity', async () => {
  const originalFindById = Product.findById;
  const originalActivityCreate = AdminActivity.create;

  let createdActivity = null;

  const product = {
    _id: 'product-1',
    title: 'Laptop',
    status: 'pending',
    isHidden: true,
    approvedAt: null,
    approvedBy: null,
    async save() {
      return this;
    },
    async populate() {
      return this;
    }
  };

  Product.findById = () => ({
    populate: async () => product
  });
  AdminActivity.create = async (payload) => {
    createdActivity = payload;
    return payload;
  };

  const req = {
    user: { id: '507f1f77bcf86cd799439012' },
    params: { id: '507f1f77bcf86cd799439011' }
  };
  const res = createRes();

  try {
    await adminController.approveProduct(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(product.status, 'approved');
    assert.equal(product.isHidden, false);
    assert.equal(product.approvedBy, '507f1f77bcf86cd799439012');
    assert.ok(product.approvedAt instanceof Date);
    assert.deepEqual(createdActivity, {
      admin: '507f1f77bcf86cd799439012',
      action: 'approve_product',
      targetType: 'product',
      targetId: 'product-1',
      details: { title: 'Laptop' }
    });
  } finally {
    Product.findById = originalFindById;
    AdminActivity.create = originalActivityCreate;
  }
});

test('updateUserRole rejects self role changes', async () => {
  const req = {
    user: { id: '507f1f77bcf86cd799439011' },
    params: { id: '507f1f77bcf86cd799439011' },
    body: { role: 'user' }
  };
  const res = createRes();

  await adminController.updateUserRole(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'Cannot change your own admin role');
});

test('updateUserBan rejects malformed ids before database access', async () => {
  const req = {
    user: { id: 'admin-1' },
    params: { id: 'not-an-object-id' },
    body: { isBanned: true }
  };
  const res = createRes();

  await adminController.updateUserBan(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'User id is invalid');
});
