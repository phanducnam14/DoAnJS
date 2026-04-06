const User = require('../schemas/User');
const Notification = require('../schemas/Notification');
const mongoose = require('mongoose');
const { sanitizeUser, pickAllowedFields } = require('../utils/response');

const PROFILE_FIELDS = ['name', 'phone', 'location'];
const normalizeFilePath = (filePath) => String(filePath || '').replace(/\\/g, '/');

// @desc Get current user
// @route GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role location');
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = pickAllowedFields(req.body, PROFILE_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid profile fields provided' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
      .populate('role location');
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Upload avatar
// @route PUT /api/users/avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

    const avatarPath = normalizeFilePath(req.files[0].path);
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath }, { new: true });
    res.json({ success: true, data: { avatar: avatarPath, user: sanitizeUser(user) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get current user notifications
// @route GET /api/users/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      type: { $ne: 'message' }
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Mark all user notifications as read
// @route PUT /api/users/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        type: { $ne: 'message' },
        isRead: false
      },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Mark a single notification as read
// @route PUT /api/users/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Notification id is invalid' });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        type: { $ne: 'message' }
      },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

