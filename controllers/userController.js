const User = require('../schemas/User');

// @desc Get current user
// @route GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role location');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
      .populate('role location');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Upload avatar
// @route PUT /api/users/avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

    const avatarPath = req.files[0].path;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath }, { new: true });
    res.json({ success: true, data: { avatar: avatarPath, user } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

