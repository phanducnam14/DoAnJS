const express = require('express');
const {
  getMe,
  updateProfile,
  uploadAvatar,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
} = require('../controllers/userController');
const { protect } = require('../utils/jwt');
const { uploadImages } = require('../utils/upload');

const router = express.Router();

router.use(protect);
router.get('/me', getMe);
router.get('/notifications', getNotifications);
router.put('/notifications/read-all', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/profile', updateProfile);
router.put('/avatar', uploadImages, uploadAvatar);

module.exports = router;

