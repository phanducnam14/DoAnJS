const jwt = require('jsonwebtoken');
const User = require('../schemas/User'); // will create later

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_development';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Sign access & refresh tokens
const signTokens = (userId, role) => {
  const payload = { userId, role };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
  return { accessToken, refreshToken };
};

// Verify access token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Middleware: protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Check role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { signTokens, verifyToken, protect, authorize };

