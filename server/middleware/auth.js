const jwt = require('jsonwebtoken');
const { ActiveSession } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Allow demo fallback token in development
    if (token === 'demo-fallback-token' && process.env.NODE_ENV === 'development') {
      req.user = { userId: 1, role: 'ADMIN' };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if session is still active
    const session = await ActiveSession.findOne({
      where: {
        token,
        userId: decoded.userId,
        status: 'ACTIVE'
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session has been invalidated. You have been logged out.',
        sessionInvalidated: true
      });
    }

    // Update last activity time
    await session.update({ lastActivityTime: new Date() });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticate, isAdmin };
