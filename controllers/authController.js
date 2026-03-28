const User = require('../schemas/User');
const Role = require('../schemas/Role');
const { signTokens } = require('../utils/jwt');
const { registerSchema, loginSchema } = require('../utils/validators');
const bcrypt = require('bcryptjs');

// @desc Register
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    let userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      await Role.create([{ name: 'user' }, { name: 'admin' }]);
      userRole = await Role.findOne({ name: 'user' });
    }

    const user = await User.create({ name, email, password, phone, role: userRole._id });

    const { accessToken, refreshToken } = signTokens(user._id, userRole.name);

    res.status(201).json({
      success: true,
      data: { user: { id: user._id, name, email }, tokens: { accessToken, refreshToken } }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('role');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBanned) return res.status(403).json({ message: 'Account banned' });

    const { accessToken, refreshToken } = signTokens(user._id, user.role.name);

    res.json({
      success: true,
      data: { 
        user: { id: user._id, name: user.name, email, role: user.role.name }, 
        tokens: { accessToken, refreshToken } 
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

