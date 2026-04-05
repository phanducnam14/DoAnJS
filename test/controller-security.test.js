const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../schemas/User');
const Product = require('../schemas/Product');
<<<<<<< HEAD
=======
const Image = require('../schemas/Image');
>>>>>>> f380d9a (edit picture/duyet)
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const { sanitizeUser, pickAllowedFields } = require('../utils/response');

<<<<<<< HEAD
=======
const updateProductHandler = productController.updateProduct[productController.updateProduct.length - 1];

>>>>>>> f380d9a (edit picture/duyet)
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
  const originalFindOne = Product.findOne;
  const originalFindOneAndUpdate = Product.findOneAndUpdate;

<<<<<<< HEAD
  Product.findOne = async () => ({
    _id: 'product-1',
    seller: 'user-1',
    status: 'pending'
=======
  Product.findOne = () => ({
    populate: async () => ({
      _id: 'product-1',
      seller: 'user-1',
      status: 'pending',
      images: []
    })
>>>>>>> f380d9a (edit picture/duyet)
  });

  Product.findOneAndUpdate = (query, updates) => {
    assert.deepEqual(query, { _id: 'product-1', seller: 'user-1' });
    assert.deepEqual(updates, { title: 'New title', isSold: true });

    return {
<<<<<<< HEAD
      populate: async () => ({
        _id: 'product-1',
        title: 'New title',
        isSold: true,
        isBoosted: false,
        seller: 'user-1'
      })
=======
      populate() {
        return this;
      },
      then(resolve) {
        return Promise.resolve(resolve({
          _id: 'product-1',
          title: 'New title',
          isSold: true,
          isBoosted: false,
          seller: 'user-1'
        }));
      }
>>>>>>> f380d9a (edit picture/duyet)
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
<<<<<<< HEAD
    await productController.updateProduct[1](req, res);
=======
    await updateProductHandler(req, res);
>>>>>>> f380d9a (edit picture/duyet)
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.data.isBoosted, false);
    assert.equal(res.payload.data.title, 'New title');
  } finally {
    Product.findOne = originalFindOne;
    Product.findOneAndUpdate = originalFindOneAndUpdate;
  }
});

test('updateProduct resets moderation when approved content changes', async () => {
  const originalFindOne = Product.findOne;
  const originalFindOneAndUpdate = Product.findOneAndUpdate;

<<<<<<< HEAD
  Product.findOne = async () => ({
    _id: 'product-1',
    seller: 'user-1',
    status: 'approved'
=======
  Product.findOne = () => ({
    populate: async () => ({
      _id: 'product-1',
      seller: 'user-1',
      status: 'approved',
      images: []
    })
>>>>>>> f380d9a (edit picture/duyet)
  });

  Product.findOneAndUpdate = (query, updates) => {
    assert.deepEqual(query, { _id: 'product-1', seller: 'user-1' });
    assert.deepEqual(updates, {
      title: 'Updated title',
      status: 'pending',
      approvedAt: null,
      approvedBy: null,
      isHidden: false
    });

    return {
<<<<<<< HEAD
      populate: async () => ({
        _id: 'product-1',
        title: 'Updated title',
        status: 'pending'
      })
=======
      populate() {
        return this;
      },
      then(resolve) {
        return Promise.resolve(resolve({
          _id: 'product-1',
          title: 'Updated title',
          status: 'pending'
        }));
      }
>>>>>>> f380d9a (edit picture/duyet)
    };
  };

  const req = {
    params: { id: 'product-1' },
    user: { id: 'user-1' },
    body: { title: 'Updated title' }
  };
  const res = createRes();

  try {
<<<<<<< HEAD
    await productController.updateProduct[1](req, res);
=======
    await updateProductHandler(req, res);
>>>>>>> f380d9a (edit picture/duyet)
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.data.status, 'pending');
  } finally {
    Product.findOne = originalFindOne;
    Product.findOneAndUpdate = originalFindOneAndUpdate;
  }
});
<<<<<<< HEAD
=======

test('updateProduct can remove and add images for the owner', async () => {
  const originalFindOne = Product.findOne;
  const originalFindOneAndUpdate = Product.findOneAndUpdate;
  const originalInsertMany = Image.insertMany;
  const originalDeleteMany = Image.deleteMany;

  Product.findOne = () => ({
    populate: async () => ({
      _id: 'product-1',
      seller: 'user-1',
      status: 'approved',
      images: [
        { _id: 'img-1', url: 'uploads/old-1.png' },
        { _id: 'img-2', url: 'uploads/old-2.png' }
      ]
    })
  });

  Image.insertMany = async () => ([{ _id: 'img-3', url: 'uploads/new.png' }]);
  Image.deleteMany = async () => ({ deletedCount: 1 });

  Product.findOneAndUpdate = (query, updates) => {
    assert.deepEqual(query, { _id: 'product-1', seller: 'user-1' });
    assert.deepEqual(updates, {
      images: ['img-2', 'img-3'],
      status: 'pending',
      approvedAt: null,
      approvedBy: null,
      isHidden: false
    });

    return {
      populate() {
        return this;
      },
      then(resolve) {
        return Promise.resolve(resolve({
          _id: 'product-1',
          seller: { _id: 'user-1' },
          images: [{ _id: 'img-2' }, { _id: 'img-3' }],
          status: 'pending'
        }));
      }
    };
  };

  const req = {
    params: { id: 'product-1' },
    user: { id: 'user-1' },
    body: { removeImageIds: 'img-1' },
    files: {
      images: [{ path: 'uploads\\new.png' }],
      replaceImages: []
    }
  };
  const res = createRes();

  try {
    await updateProductHandler(req, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.payload.data.images, [{ _id: 'img-2' }, { _id: 'img-3' }]);
  } finally {
    Product.findOne = originalFindOne;
    Product.findOneAndUpdate = originalFindOneAndUpdate;
    Image.insertMany = originalInsertMany;
    Image.deleteMany = originalDeleteMany;
  }
});

test('updateProduct rejects mismatched replacement payloads', async () => {
  const req = {
    params: { id: 'product-1' },
    user: { id: 'user-1' },
    body: { replaceImageIds: 'img-1' },
    files: {
      images: [],
      replaceImages: []
    }
  };
  const res = createRes();

  await updateProductHandler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, 'Replacement images are invalid');
});
>>>>>>> f380d9a (edit picture/duyet)
