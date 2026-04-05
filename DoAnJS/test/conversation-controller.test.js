const test = require('node:test');
const assert = require('node:assert/strict');

const Conversation = require('../schemas/Conversation');
const Message = require('../schemas/Message');
const Product = require('../schemas/Product');
const controller = require('../controllers/conversationController');

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

const queryResult = (value) => ({
  populate() {
    return this;
  },
  sort() {
    return this;
  },
  then(resolve) {
    return Promise.resolve(resolve(value));
  }
});

test('buildParticipantKey is stable regardless of user order', () => {
  assert.equal(controller.buildParticipantKey(['b', 'a']), 'a:b');
});

test('buildProductSnapshot stores stable product banner data', () => {
  const snapshot = controller.buildProductSnapshot({
    title: 'Phone X',
    price: 1200,
    images: [{ url: 'uploads\\phone.png' }],
    isSold: true
  });

  assert.deepEqual(snapshot, {
    title: 'Phone X',
    price: 1200,
    imageUrl: 'uploads/phone.png',
    status: 'da_ban'
  });
});

test('getConversationProductMeta falls back to snapshot when product is gone', () => {
  const meta = controller.getConversationProductMeta({
    product: null,
    productSnapshot: {
      title: 'Removed product',
      price: 500,
      imageUrl: 'uploads/removed.png',
      status: 'da_an'
    }
  });

  assert.deepEqual(meta, {
    _id: null,
    title: 'Removed product',
    price: 500,
    imageUrl: 'uploads/removed.png',
    status: 'da_an',
    available: false
  });
});

test('createConversation stores product snapshot and keys by buyer seller product', async () => {
  const originalFindById = Product.findById;
  const originalFindOne = Conversation.findOne;
  const originalCreate = Conversation.create;
  const originalConversationFindById = Conversation.findById;

  let createdPayload = null;

  Product.findById = () => ({
    select() {
      return this;
    },
    populate: async () => ({
      _id: 'product-1',
      title: 'Sample product',
      seller: 'seller-1',
      price: 999,
      images: [{ url: 'uploads/sample.png' }],
      isSold: false
    })
  });
  Conversation.findOne = () => queryResult(null);
  Conversation.create = async (payload) => {
    createdPayload = payload;
    return { _id: 'conv-1' };
  };
  Conversation.findById = () => queryResult({
    _id: 'conv-1',
    participants: [{ _id: 'buyer-1' }, { _id: 'seller-1' }],
    product: {
      _id: 'product-1',
      title: 'Sample product',
      price: 999,
      images: [{ url: 'uploads/sample.png' }],
      isSold: false
    },
    productSnapshot: {
      title: 'Sample product',
      price: 999,
      imageUrl: 'uploads/sample.png',
      status: 'dang_ban'
    },
    toObject() {
      return {
        _id: 'conv-1',
        participants: this.participants,
        product: this.product,
        productSnapshot: this.productSnapshot
      };
    }
  });

  const req = { user: { id: 'buyer-1' }, body: { productId: '507f1f77bcf86cd799439011' } };
  const res = createRes();

  try {
    await controller.createConversation(req, res);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(createdPayload, {
      participants: ['buyer-1', 'seller-1'],
      participantKey: 'buyer-1:seller-1',
      product: '507f1f77bcf86cd799439011',
      productSnapshot: {
        title: 'Sample product',
        price: 999,
        imageUrl: 'uploads/sample.png',
        status: 'dang_ban'
      }
    });
    assert.equal(res.payload.data.productMeta.title, 'Sample product');
  } finally {
    Product.findById = originalFindById;
    Conversation.findOne = originalFindOne;
    Conversation.create = originalCreate;
    Conversation.findById = originalConversationFindById;
  }
});

test('createConversation rejects starting chat on own product', async () => {
  const originalFindById = Product.findById;
  Product.findById = () => ({
    select() {
      return this;
    },
    populate: async () => ({ _id: 'product-1', seller: 'user-1', title: 'Product', images: [] })
  });

  const req = { user: { id: 'user-1' }, body: { productId: '507f1f77bcf86cd799439011' } };
  const res = createRes();

  try {
    await controller.createConversation(req, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.message, 'Cannot start a conversation on your own product');
  } finally {
    Product.findById = originalFindById;
  }
});

test('createConversation rejects pending or hidden products', async () => {
  const originalFindById = Product.findById;
  Product.findById = () => ({
    select() {
      return this;
    },
    populate: async () => ({ _id: 'product-1', seller: 'seller-1', title: 'Hidden Product', images: [], isHidden: true, status: 'pending' })
  });

  const req = { user: { id: 'buyer-1' }, body: { productId: '507f1f77bcf86cd799439011' } };
  const res = createRes();

  try {
    await controller.createConversation(req, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.message, 'Product is not available for conversation');
  } finally {
    Product.findById = originalFindById;
  }
});

test('sendMessage rejects users outside the conversation', async () => {
  const originalFindById = Conversation.findById;
  Conversation.findById = async () => ({ _id: 'conv-1', participants: [{ _id: 'user-2' }, { _id: 'user-3' }] });

  const req = { user: { id: 'user-1' }, params: { id: 'conv-1' }, body: { content: 'Hello' } };
  const res = createRes();

  try {
    await controller.sendMessage(req, res);
    assert.equal(res.statusCode, 403);
    assert.equal(res.payload.message, 'Access denied');
  } finally {
    Conversation.findById = originalFindById;
  }
});

test('sendMessage rejects self messaging in malformed self-conversations', async () => {
  const originalFindById = Conversation.findById;
  Conversation.findById = async () => ({ _id: 'conv-1', participants: [{ _id: 'user-1' }, { _id: 'user-1' }] });

  const req = { user: { id: 'user-1' }, params: { id: 'conv-1' }, body: { content: 'Hello myself' } };
  const res = createRes();

  try {
    await controller.sendMessage(req, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.message, 'Cannot send messages to yourself');
  } finally {
    Conversation.findById = originalFindById;
  }
});

test('getConversationMessages marks incoming unread messages as read for participants', async () => {
  const originalConversationFindById = Conversation.findById;
  const originalUpdateMany = Message.updateMany;
  const originalMessageFind = Message.find;

  let updateQuery = null;

  Conversation.findById = () => queryResult({
    _id: 'conv-1',
    participants: [{ _id: 'user-1' }, { _id: 'user-2' }],
    product: { title: 'Sample product' },
    toObject() {
      return { _id: 'conv-1', participants: this.participants, product: this.product };
    }
  });
  Message.updateMany = async (query) => {
    updateQuery = query;
  };
  Message.find = () => ({
    populate() {
      return this;
    },
    sort: async () => ([{ _id: 'msg-1', content: 'Hello', isRead: true }])
  });

  const req = { user: { id: 'user-1' }, params: { id: 'conv-1' } };
  const res = createRes();

  try {
    await controller.getConversationMessages(req, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(updateQuery, { conversation: 'conv-1', receiver: 'user-1', isRead: false });
    assert.equal(res.payload.data.messages.length, 1);
  } finally {
    Conversation.findById = originalConversationFindById;
    Message.updateMany = originalUpdateMany;
    Message.find = originalMessageFind;
  }
});
