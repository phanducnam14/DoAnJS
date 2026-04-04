const express = require('express');

const {
  createConversation,
  getConversations,
  getConversationMessages,
  sendMessage
} = require('../controllers/conversationController');
const { protect } = require('../utils/jwt');

const router = express.Router();

router.use(protect);
router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id/messages', getConversationMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;
