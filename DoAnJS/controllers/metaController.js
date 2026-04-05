const Category = require('../schemas/Category');
const Location = require('../schemas/Location');
const Notification = require('../schemas/Notification');
require('../schemas/SubCategory');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subCategories').sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ province: 1, district: 1 });
    res.json({ success: true, data: locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, data: { unreadCount: 0, messageCount: 0 } });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    const messageCount = await Notification.countDocuments({
      user: req.user.id,
      type: 'message',
      isRead: false
    });

    res.json({ success: true, data: { unreadCount, messageCount } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
