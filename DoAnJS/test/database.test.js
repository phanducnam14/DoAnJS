const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const connectDB = require('../config/database');

test('connectDB uses configured URI and returns the mongoose connection result', async () => {
  const originalConnect = mongoose.connect;
  const originalUri = process.env.MONGO_URI;
  const fakeConnection = { connection: { host: 'stub-host' } };

  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/test-suite';
  mongoose.connect = async (uri) => {
    assert.equal(uri, process.env.MONGO_URI);
    return fakeConnection;
  };

  try {
    const result = await connectDB();
    assert.equal(result, fakeConnection);
  } finally {
    mongoose.connect = originalConnect;

    if (originalUri === undefined) {
      delete process.env.MONGO_URI;
    } else {
      process.env.MONGO_URI = originalUri;
    }
  }
});

test('connectDB propagates connection errors instead of exiting the process', async () => {
  const originalConnect = mongoose.connect;
  const failure = new Error('db unavailable');

  mongoose.connect = async () => {
    throw failure;
  };

  try {
    await assert.rejects(connectDB(), failure);
  } finally {
    mongoose.connect = originalConnect;
  }
});
