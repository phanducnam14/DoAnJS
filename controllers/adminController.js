const User = require('../schemas/User');
const Role = require('../schemas/Role');
const Product = require('../schemas/Product');
const ProductReport = require('../schemas/ProductReport');
const AdminActivity = require('../schemas/AdminActivity');
const Notification = require('../schemas/Notification');
const { sanitizeUser, pickAllowedFields } = require('../utils/response');
const mongoose = require('mongoose');

const ADMIN_USER_FIELDS = ['name', 'email', 'phone', 'isBanned', 'createdAt', 'updatedAt'];
const ADMIN_PRODUCT_POPULATE = [
  { path: 'seller', select: 'name email phone isBanned' },
  { path: 'category', select: 'name' },
  { path: 'location', select: 'province district ward address' },
  { path: 'images', select: 'url' },
  { path: 'approvedBy', select: 'name email' },
  { path: 'rejectedBy', select: 'name email' },
  { path: 'hiddenBy', select: 'name email' }
];

const PRODUCT_STATUS_FILTERS = ['pending', 'approved', 'rejected'];
const REPORT_STATUS_FILTERS = ['pending', 'reviewed', 'dismissed'];
const ADMIN_REPORT_NOTE_LIMIT = 500;
const ADMIN_REPORT_POPULATE = [
  { path: 'product', populate: [{ path: 'seller', select: 'name email phone isBanned' }, { path: 'category', select: 'name' }, { path: 'location', select: 'province district ward address' }] },
  { path: 'reporter', select: 'name email phone isBanned' },
  { path: 'seller', select: 'name email phone isBanned' },
  { path: 'reviewedBy', select: 'name email' }
];

const readReason = (value) => String(value || '').trim();

const clearApprovalState = (product) => {
  product.approvedAt = null;
  product.approvedBy = null;
};

const clearRejectionState = (product) => {
  product.rejectedAt = null;
  product.rejectedBy = null;
  product.rejectionReason = '';
};

const clearHiddenState = (product) => {
  product.isHidden = false;
  product.hiddenAt = null;
  product.hiddenBy = null;
  product.hiddenReason = '';
};

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

const attachProductReportStats = async (products) => {
  const items = Array.isArray(products) ? products : [];
  const productIds = items.map((product) => product?._id).filter(Boolean);
  if (productIds.length === 0) return items;

  const stats = await ProductReport.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: { product: '$product', status: '$status' }, count: { $sum: 1 } } }
  ]);

  const statsMap = new Map();
  stats.forEach((entry) => {
    const productId = String(entry?._id?.product || '');
    const status = String(entry?._id?.status || 'pending');
    const current = statsMap.get(productId) || { pending: 0, reviewed: 0, dismissed: 0, total: 0 };
    current[status] = entry.count;
    current.total += entry.count;
    statsMap.set(productId, current);
  });

  items.forEach((product) => {
    product.reportStats = statsMap.get(String(product?._id || '')) || { pending: 0, reviewed: 0, dismissed: 0, total: 0 };
  });

  return items;
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
      rejectedProducts,
      hiddenProducts,
      soldProducts,
      boostedProducts,
      pendingReports,
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
      Product.countDocuments({ status: 'rejected' }),
      Product.countDocuments({ isHidden: true }),
      Product.countDocuments({ isSold: true }),
      Product.countDocuments({ isBoosted: true }),
      ProductReport.countDocuments({ status: 'pending' }),
      AdminActivity.find().sort({ createdAt: -1 }).limit(5).populate('admin', 'name email'),
      adminRole ? User.countDocuments({ role: adminRole._id }) : 0,
      User.find().populate('role location').sort({ createdAt: -1 }).limit(5),
      Product.find({ status: 'pending' }).populate(ADMIN_PRODUCT_POPULATE).sort({ createdAt: -1 }).limit(5),
      AdminActivity.countDocuments()
    ]);

    await attachProductReportStats(recentProducts);

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
          rejectedProducts,
          hiddenProducts,
          soldProducts,
          boostedProducts,
          pendingReports,
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

exports.getReports = async (req, res) => {
  try {
    const query = {};

    if (req.query.status && REPORT_STATUS_FILTERS.includes(req.query.status)) {
      query.status = req.query.status;
    }

    const reports = await ProductReport.find(query)
      .populate(ADMIN_REPORT_POPULATE)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reviewReport = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'Report id')) return;

    const status = String(req.body.status || '').trim();
    if (!['reviewed', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Report status is invalid' });
    }

    const adminNote = readReason(req.body.adminNote);
    const report = await ProductReport.findById(req.params.id).populate(ADMIN_REPORT_POPULATE);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending reports can be reviewed' });
    }

    if (adminNote.length > ADMIN_REPORT_NOTE_LIMIT) {
      return res.status(400).json({ message: `Admin note must be at most ${ADMIN_REPORT_NOTE_LIMIT} characters` });
    }

    report.status = status;
    report.reviewedBy = req.user.id;
    report.reviewedAt = new Date();
    report.adminNote = adminNote;
    await report.save();
    await report.populate(ADMIN_REPORT_POPULATE);

    await logAdminActivity(req.user.id, status === 'dismissed' ? 'dismiss_report' : 'review_report', 'report', report._id, {
      product: report.product?._id || report.product,
      productTitle: report.product?.title || report.productSnapshot?.title || '',
      reporter: report.reporter?._id || report.reporter,
      status,
      adminNote
    });

    res.json({ success: true, data: report });
  } catch (err) {
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

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

    if (req.query.status && PRODUCT_STATUS_FILTERS.includes(req.query.status)) {
      query.status = req.query.status;
    }

    if (req.query.hidden === 'true') query.isHidden = true;
    if (req.query.hidden === 'false') query.isHidden = false;

    const products = await Product.find(query)
      .populate(ADMIN_PRODUCT_POPULATE)
      .sort({ createdAt: -1 });

    await attachProductReportStats(products);

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
    clearRejectionState(product);
    clearHiddenState(product);
    product.approvedAt = new Date();
    product.approvedBy = req.user.id;
    await product.save();
    await product.populate(ADMIN_PRODUCT_POPULATE);

    await logAdminActivity(req.user.id, 'approve_product', 'product', product._id, {
      title: product.title,
      status: product.status
    });

    if (product.seller?._id || product.seller) {
      await Notification.create({
        user: product.seller?._id || product.seller,
        type: 'product',
        title: 'Bài đăng đã được duyệt',
        message: `Tin đăng "${product.title}" của bạn đã được duyệt và đang hiển thị trên hệ thống.`,
        relatedId: product._id
      });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'Product id')) return;

    const reason = readReason(req.body.reason);
    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    const product = await Product.findById(req.params.id).populate(ADMIN_PRODUCT_POPULATE);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = 'rejected';
    clearApprovalState(product);
    clearHiddenState(product);
    product.rejectedAt = new Date();
    product.rejectedBy = req.user.id;
    product.rejectionReason = reason;
    await product.save();
    await product.populate(ADMIN_PRODUCT_POPULATE);

    await logAdminActivity(req.user.id, 'reject_product', 'product', product._id, {
      title: product.title,
      reason,
      status: product.status
    });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hideProduct = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'Product id')) return;

    const reason = readReason(req.body.reason);
    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    const product = await Product.findById(req.params.id).populate(ADMIN_PRODUCT_POPULATE);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved products can be hidden' });
    }

    product.isHidden = true;
    product.hiddenAt = new Date();
    product.hiddenBy = req.user.id;
    product.hiddenReason = reason;
    await product.save();
    await product.populate(ADMIN_PRODUCT_POPULATE);

    await logAdminActivity(req.user.id, 'hide_product', 'product', product._id, {
      title: product.title,
      reason,
      status: product.status,
      isHidden: product.isHidden
    });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unhideProduct = async (req, res) => {
  try {
    if (!ensureValidObjectId(req.params.id, res, 'Product id')) return;

    const product = await Product.findById(req.params.id).populate(ADMIN_PRODUCT_POPULATE);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (!product.isHidden) {
      return res.status(400).json({ message: 'Product is not hidden' });
    }

    clearHiddenState(product);
    await product.save();
    await product.populate(ADMIN_PRODUCT_POPULATE);

    await logAdminActivity(req.user.id, 'unhide_product', 'product', product._id, {
      title: product.title,
      status: product.status,
      isHidden: product.isHidden
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
