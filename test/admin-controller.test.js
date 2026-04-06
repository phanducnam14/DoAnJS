const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../schemas/User');
const Role = require('../schemas/Role');
const Product = require('../schemas/Product');
const AdminActivity = require('../schemas/AdminActivity');
const Notification = require('../schemas/Notification');
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
  const originalNotificationCreate = Notification.create;

  let createdActivity = null;
  let createdNotification = null;

  const product = {
    _id: 'product-1',
    title: 'Laptop',
    seller: { _id: 'seller-1' },
    status: 'pending',
    isHidden: true,
    approvedAt: null,
    approvedBy: null,
    rejectedAt: new Date('2024-01-01T00:00:00.000Z'),
    rejectedBy: 'admin-old',
    rejectionReason: 'Thiếu ảnh',
    hiddenAt: new Date('2024-01-02T00:00:00.000Z'),
    hiddenBy: 'admin-old',
    hiddenReason: 'Tạm ẩn',
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
  Notification.create = async (payload) => {
    createdNotification = payload;
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
    assert.equal(product.rejectedBy, null);
    assert.equal(product.rejectionReason, '');
    assert.equal(product.hiddenBy, null);
    assert.equal(product.hiddenReason, '');
    assert.deepEqual(createdActivity, {
      admin: '507f1f77bcf86cd799439012',
      action: 'approve_product',
      targetType: 'product',
      targetId: 'product-1',
      details: { title: 'Laptop', status: 'approved' }
    });
    assert.deepEqual(createdNotification, {
      user: 'seller-1',
      type: 'product',
      title: 'Bài đăng đã được duyệt',
      message: 'Tin đăng "Laptop" của bạn đã được duyệt và đang hiển thị trên hệ thống.',
      relatedId: 'product-1'
    });
  } finally {
    Product.findById = originalFindById;
    AdminActivity.create = originalActivityCreate;
    Notification.create = originalNotificationCreate;
  }
});

test('rejectProduct marks product rejected with reason and logs admin activity', async () => {
  const originalFindById = Product.findById;
  const originalActivityCreate = AdminActivity.create;

  let createdActivity = null;

  const product = {
    _id: 'product-2',
    title: 'Điện thoại',
    status: 'approved',
    isHidden: true,
    approvedAt: new Date('2024-01-01T00:00:00.000Z'),
    approvedBy: 'admin-old',
    rejectedAt: null,
    rejectedBy: null,
    rejectionReason: '',
    hiddenAt: new Date('2024-01-02T00:00:00.000Z'),
    hiddenBy: 'admin-old',
    hiddenReason: 'Tạm ẩn',
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
    params: { id: '507f1f77bcf86cd799439011' },
    body: { reason: 'Sai danh mục' }
  };
  const res = createRes();

  try {
    await adminController.rejectProduct(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(product.status, 'rejected');
    assert.equal(product.isHidden, false);
    assert.equal(product.approvedBy, null);
    assert.equal(product.rejectedBy, '507f1f77bcf86cd799439012');
    assert.equal(product.rejectionReason, 'Sai danh mục');
    assert.equal(product.hiddenBy, null);
    assert.equal(product.hiddenReason, '');
    assert.ok(product.rejectedAt instanceof Date);
    assert.deepEqual(createdActivity, {
      admin: '507f1f77bcf86cd799439012',
      action: 'reject_product',
      targetType: 'product',
      targetId: 'product-2',
      details: { title: 'Điện thoại', reason: 'Sai danh mục', status: 'rejected' }
    });
  } finally {
    Product.findById = originalFindById;
    AdminActivity.create = originalActivityCreate;
  }
});

test('rejectProduct requires a reason', async () => {
  const req = {
    user: { id: '507f1f77bcf86cd799439012' },
    params: { id: '507f1f77bcf86cd799439011' },
    body: { reason: '   ' }
  };
  const res = createRes();

  await adminController.rejectProduct(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'Reason is required');
});

test('hideProduct marks product hidden with reason and logs admin activity', async () => {
  const originalFindById = Product.findById;
  const originalActivityCreate = AdminActivity.create;

  let createdActivity = null;

  const product = {
    _id: 'product-3',
    title: 'Máy ảnh',
    status: 'approved',
    isHidden: false,
    hiddenAt: null,
    hiddenBy: null,
    hiddenReason: '',
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
    params: { id: '507f1f77bcf86cd799439011' },
    body: { reason: 'Nghi ngờ nội dung vi phạm' }
  };
  const res = createRes();

  try {
    await adminController.hideProduct(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(product.isHidden, true);
    assert.equal(product.hiddenBy, '507f1f77bcf86cd799439012');
    assert.equal(product.hiddenReason, 'Nghi ngờ nội dung vi phạm');
    assert.ok(product.hiddenAt instanceof Date);
    assert.deepEqual(createdActivity, {
      admin: '507f1f77bcf86cd799439012',
      action: 'hide_product',
      targetType: 'product',
      targetId: 'product-3',
      details: {
        title: 'Máy ảnh',
        reason: 'Nghi ngờ nội dung vi phạm',
        status: 'approved',
        isHidden: true
      }
    });
  } finally {
    Product.findById = originalFindById;
    AdminActivity.create = originalActivityCreate;
  }
});

test('hideProduct rejects non-approved products', async () => {
  const originalFindById = Product.findById;

  const product = {
    _id: 'product-5',
    title: 'Tin chờ duyệt',
    status: 'pending',
    isHidden: false
  };

  Product.findById = () => ({
    populate: async () => product
  });

  const req = {
    user: { id: '507f1f77bcf86cd799439012' },
    params: { id: '507f1f77bcf86cd799439011' },
    body: { reason: 'Tam an' }
  };
  const res = createRes();

  try {
    await adminController.hideProduct(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.message, 'Only approved products can be hidden');
  } finally {
    Product.findById = originalFindById;
  }
});

test('unhideProduct clears hidden state and logs admin activity', async () => {
  const originalFindById = Product.findById;
  const originalActivityCreate = AdminActivity.create;

  let createdActivity = null;

  const product = {
    _id: 'product-4',
    title: 'Laptop gaming',
    status: 'approved',
    isHidden: true,
    hiddenAt: new Date('2024-01-01T00:00:00.000Z'),
    hiddenBy: 'admin-old',
    hiddenReason: 'Chờ kiểm tra',
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
    await adminController.unhideProduct(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(product.isHidden, false);
    assert.equal(product.hiddenBy, null);
    assert.equal(product.hiddenReason, '');
    assert.equal(product.hiddenAt, null);
    assert.deepEqual(createdActivity, {
      admin: '507f1f77bcf86cd799439012',
      action: 'unhide_product',
      targetType: 'product',
      targetId: 'product-4',
      details: { title: 'Laptop gaming', status: 'approved', isHidden: false }
    });
  } finally {
    Product.findById = originalFindById;
    AdminActivity.create = originalActivityCreate;
  }
});

test('unhideProduct rejects products that are not hidden', async () => {
  const originalFindById = Product.findById;

  const product = {
    _id: 'product-6',
    title: 'Tin dang hien',
    status: 'approved',
    isHidden: false
  };

  Product.findById = () => ({
    populate: async () => product
  });

  const req = {
    user: { id: '507f1f77bcf86cd799439012' },
    params: { id: '507f1f77bcf86cd799439011' }
  };
  const res = createRes();

  try {
    await adminController.unhideProduct(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.message, 'Product is not hidden');
  } finally {
    Product.findById = originalFindById;
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
