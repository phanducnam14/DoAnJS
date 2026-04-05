const mongoose = require('mongoose');

const Conversation = require('../schemas/Conversation');
const Message = require('../schemas/Message');
const Product = require('../schemas/Product');

const PARTICIPANT_FIELDS = 'name email avatar';
const PRODUCT_FIELDS = 'title price images seller isSold isHidden';

const buildParticipantKey = (userIds) => userIds
  .map((value) => String(value))
  .sort()
  .join(':');

const isParticipant = (conversation, userId) => conversation.participants
  .some((participant) => String(participant._id || participant) === String(userId));

const getOtherParticipantId = (conversation, userId) => {
  const match = conversation.participants.find((participant) => String(participant._id || participant) !== String(userId));
  return match ? String(match._id || match) : null;
};

const normalizeAssetPath = (value) => String(value || '').replace(/\\/g, '/');

const resolveProductStatus = (product) => {
  if (product?.isHidden) return 'da_an';
  if (product?.isSold) return 'da_ban';
  return 'dang_ban';
};

const buildProductSnapshot = (product) => ({
  title: product?.title || 'San pham khong xac dinh',
  price: typeof product?.price === 'number' ? product.price : null,
  imageUrl: normalizeAssetPath(product?.images?.[0]?.url),
  status: resolveProductStatus(product)
});

const getConversationProductMeta = (conversation) => {
  const product = conversation?.product;
  const snapshot = conversation?.productSnapshot || {};

  if (!product) {
    return {
      _id: null,
      title: snapshot.title || 'San pham khong xac dinh',
      price: typeof snapshot.price === 'number' ? snapshot.price : null,
      imageUrl: snapshot.imageUrl || '',
      status: snapshot.status || 'dang_ban',
      available: false
    };
  }

  return {
    _id: product._id,
    title: product.title || snapshot.title || 'San pham khong xac dinh',
    price: typeof product.price === 'number' ? product.price : snapshot.price,
    imageUrl: normalizeAssetPath(product.images?.[0]?.url) || snapshot.imageUrl || '',
    status: resolveProductStatus(product) || snapshot.status || 'dang_ban',
    available: true
  };
};

const populateConversationQuery = (query) => query
  .populate('participants', PARTICIPANT_FIELDS)
  .populate({
    path: 'product',
    select: PRODUCT_FIELDS,
    populate: [
      { path: 'seller', select: PARTICIPANT_FIELDS },
      { path: 'images', select: 'url' }
    ]
  })
  .populate({
    path: 'lastMessage',
    populate: [
      { path: 'sender', select: PARTICIPANT_FIELDS },
      { path: 'receiver', select: PARTICIPANT_FIELDS }
    ]
  });

const serializeConversation = (conversation, unreadCount = 0) => ({
  ...conversation.toObject(),
  unreadCount,
  productMeta: getConversationProductMeta(conversation)
});

exports.createConversation = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'productId is invalid' });
    }

    const product = await Product.findById(productId)
      .select('title seller price images isSold isHidden status')
      .populate('images', 'url');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.isHidden || product.status === 'pending') {
      return res.status(400).json({ message: 'Product is not available for conversation' });
    }

    if (String(product.seller) === String(req.user.id)) {
      return res.status(400).json({ message: 'Cannot start a conversation on your own product' });
    }

    const participantIds = [req.user.id, product.seller];
    const participantKey = buildParticipantKey(participantIds);

    let conversation = await populateConversationQuery(
      Conversation.findOne({ product: productId, participantKey })
    );

    if (!conversation) {
      conversation = await Conversation.create({
        participants: participantIds,
        participantKey,
        product: productId,
        productSnapshot: buildProductSnapshot(product)
      });
      conversation = await populateConversationQuery(Conversation.findById(conversation._id));
      return res.status(201).json({ success: true, data: serializeConversation(conversation) });
    }

    res.json({ success: true, data: serializeConversation(conversation) });
  } catch (err) {
    if (err.code === 11000) {
      const product = await Product.findById(req.body.productId).select('seller');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const conversation = await populateConversationQuery(
        Conversation.findOne({ product: req.body.productId, participantKey: buildParticipantKey([req.user.id, product.seller]) })
      );
      if (conversation) {
        return res.json({ success: true, data: serializeConversation(conversation) });
      }
    }

    res.status(500).json({ message: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await populateConversationQuery(
      Conversation.find({ participants: req.user.id }).sort({ updatedAt: -1 })
    );

    const conversationIds = conversations.map((item) => item._id);
    const unreadRows = conversationIds.length
      ? await Message.aggregate([
        {
          $match: {
            conversation: { $in: conversationIds },
            receiver: new mongoose.Types.ObjectId(req.user.id),
            isRead: false
          }
        },
        {
          $group: {
            _id: '$conversation',
            unreadCount: { $sum: 1 }
          }
        }
      ])
      : [];

    const unreadMap = new Map(unreadRows.map((item) => [String(item._id), item.unreadCount]));
    const data = conversations.map((item) => serializeConversation(item, unreadMap.get(String(item._id)) || 0));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const conversation = await populateConversationQuery(Conversation.findById(req.params.id));
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!isParticipant(conversation, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.updateMany(
      { conversation: conversation._id, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', PARTICIPANT_FIELDS)
      .populate('receiver', PARTICIPANT_FIELDS)
      .sort({ createdAt: 1 });

    res.json({ success: true, data: { conversation: serializeConversation(conversation), messages } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const content = String(req.body.content || '').trim();
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!isParticipant(conversation, req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const distinctParticipants = [...new Set((conversation.participants || []).map((participant) => String(participant._id || participant)))];
    if (distinctParticipants.length < 2) {
      return res.status(400).json({ message: 'Cannot send messages to yourself' });
    }

    const receiverId = getOtherParticipantId(conversation, req.user.id);
    if (!receiverId) {
      return res.status(400).json({ message: 'Conversation participants are invalid' });
    }

    if (String(receiverId) === String(req.user.id)) {
      return res.status(400).json({ message: 'Cannot send messages to yourself' });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', PARTICIPANT_FIELDS)
      .populate('receiver', PARTICIPANT_FIELDS);

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.buildParticipantKey = buildParticipantKey;
module.exports.isParticipant = isParticipant;
module.exports.buildProductSnapshot = buildProductSnapshot;
module.exports.getConversationProductMeta = getConversationProductMeta;
