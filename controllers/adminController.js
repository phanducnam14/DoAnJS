const User = require('../schemas/User');
const Role = require('../schemas/Role');
const Product = require('../schemas/Product');
const AdminActivity = require('../schemas/AdminActivity');
const { sanitizeUser, pickAllowedFields } = require('../utils/response');
const mongoose = require('mongoose');

const ADMIN_USER_FIELDS = ['name', 'email', 'phone', 'isBanned', 'createdAt', 'updatedAt'];
const ADMIN_PRODUCT_POPULATE = [
  { path: 'seller', select: 'name email phone isBanned' },
  { path: 'category', select: 'name' },
  { path: 'location', select: 'province district ward address' },
  { path: 'images', select: 'url' },
  { path: 'approvedBy', select: 'name email' }
];

const ensureValidObjectId = (value, res, label) => {
  if (!mongoose.isValidObjectId(value)) {
    res.status(400).json({ message: `${label} is invalid` });
    return false;
  }

  return true;
};

const logAdminActivity = async (adminId, action, targetType, targetId, details = {}) => {
  await AdminActivity.create({
    admin: adminId,
    action,
    targetType,
    targetId: String(targetId),
    details
  });
};

const serializeUser = (user) => {
  const safeUser = sanitizeUser(user);
  if (!safeUser) return safeUser;

  return {
    ...pickAllowedFields(safeUser, ADMIN_USER_FIELDS),
    _id: safeUser._id,
    role: safeUser.role?.name || safeUser.role || null,
    location: safeUser.location || null,
    avatar: safeUser.avatar || ''
  };
};

exports.getDashboard = async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: 'admin' });
    const [
      totalUsers,
      bannedUsers,
      totalProducts,
      pendingProducts,
      approvedProducts,
      hiddenProducts,
      soldProducts,
      boostedProducts,
      latestActivities,
      totalAdmins,
      recentUsers,
      recentProducts,
      totalActivities
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      Product.countDocuments({ status: 'approved' }),
      Product.countDocuments({ isHidden: true }),
      Product.countDocuments({ isSold: true }),
      Product.countDocuments({ isBoosted: true }),
      AdminActivity.find().sort({ createdAt: -1 }).limit(5).populate('admin', 'name email'),
      adminRole ? User.countDocuments({ role: adminRole._id }) : 0,
      User.find().populate('role location').sort({ createdAt: -1 }).limit(5),
      Product.find({ status: 'pending' }).populate(ADMIN_PRODUCT_POPULATE).sort({ createdAt: -1 }).limit(5),
      AdminActivity.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          adminUsers: totalAdmins,
          totalAdmins,
          bannedUsers,
          totalProducts,
          pendingProducts,
          approvedProducts,
          hiddenProducts,
          soldProducts,
          boostedProducts,
          totalActivities
        },
        recentUsers: recentUsers.map(serializeUser),
        recentProducts,
        recentActivities: latestActivities,
        latestActivities
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const query = {};
    const search = String(req.query.search || '').trim();

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (req.query.banned === 'true') query.isBanned = true;
    if (req.query.banned === 'false') query.isBanned = false;

    if (req.query.role) {
      const role = await Role.findOne({ name: req.query.role });
      query.role = role ? role._id : null;
    }

    const users = await User.find(query)
      .populate('role location')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: users.map(serializeUser) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'User id')) return;
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ message: 'Cannot change your own admin role' });
    }

    const roleName = String(req.body.role || '').trim();
    if (!['user', 'admin'].includes(roleName)) {
      return res.status(400).json({ message: 'Role is invalid' });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Role not found' });
    }

    const user = await User.findById(req.params.id).populate('role location');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role._id;
    await user.save();
    await user.populate('role location');

    await logAdminActivity(req.user.id, 'update_user_role', 'user', user._id, { role: roleName });

    res.json({ success: true, data: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserBan = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'User id')) return;
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ message: 'Cannot ban your own admin account' });
    }

    if (typeof req.body.isBanned !== 'boolean') {
      return res.status(400).json({ message: 'isBanned must be a boolean' });
    }

    const user = await User.findById(req.params.id).populate('role location');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = req.body.isBanned;
    await user.save();

    await logAdminActivity(req.user.id, user.isBanned ? 'ban_user' : 'unban_user', 'user', user._id, {
      isBanned: user.isBanned
    });

    res.json({ success: true, data: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'User id')) return;
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(req.params.id).populate('role location');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await logAdminActivity(req.user.id, 'delete_user', 'user', user._id, {
      email: user.email,
      name: user.name
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const query = {};
    const search = String(req.query.search || '').trim();

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (req.query.status && ['pending', 'approved'].includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.hidden === 'true') query.isHidden = true;
    if (req.query.hidden === 'false') query.isHidden = false;

    const products = await Product.find(query)
      .populate(ADMIN_PRODUCT_POPULATE)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'Product id')) return;
    const product = await Product.findById(req.params.id).populate(ADMIN_PRODUCT_POPULATE);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = 'approved';
    product.isHidden = false;
    product.approvedAt = new Date();
    product.approvedBy = req.user.id;
    await product.save();
    await product.populate(ADMIN_PRODUCT_POPULATE);

    await logAdminActivity(req.user.id, 'approve_product', 'product', product._id, {
      title: product.title
    });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'Product id')) return;
    const product = await Product.findByIdAndDelete(req.params.id).populate(ADMIN_PRODUCT_POPULATE);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await logAdminActivity(req.user.id, 'delete_product', 'product', product._id, {
      title: product.title,
      seller: product.seller?._id || product.seller
    });

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
    const query = {};

    if (req.query.targetType && ['user', 'product', 'dashboard'].includes(req.query.targetType)) {
      query.targetType = req.query.targetType;
    }

    const activities = await AdminActivity.find(query)
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.logAdminActivity = logAdminActivity;
