const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, mobile, bankAccountNumber, bankName, ifscCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      department: department || 'Engineering',
      mobile: mobile || null,
      bankAccountNumber: bankAccountNumber || null,
      bankName: bankName || null,
      ifscCode: ifscCode || null
    });

    // Generate token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        mobile: user.mobile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update online status
    await user.update({ isOnline: true, lastActivity: new Date() });

    // Generate token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Demo Login (for testing)
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body;

    // Find or create demo user
    let user = await User.findOne({ where: { email: `${role.toLowerCase()}@demo.com` } });
    
    if (!user) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      user = await User.create({
        name: role === 'ADMIN' ? 'Admin User' : 'Demo Employee',
        email: `${role.toLowerCase()}@demo.com`,
        password: hashedPassword,
        role: role,
        department: role === 'ADMIN' ? 'Management' : 'Engineering',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
      });
    }

    await user.update({ isOnline: true, lastActivity: new Date() });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Demo login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Demo login failed', error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    await User.update({ isOnline: false }, { where: { id: userId } });

    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
});

module.exports = router;

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      department: department || 'Engineering'
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update online status
    user.isOnline = true;
    user.lastActivity = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Demo Login (for testing)
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body;

    // Find or create demo user
    let user = await User.findOne({ email: `${role.toLowerCase()}@demo.com` });
    
    if (!user) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      user = new User({
        name: role === 'ADMIN' ? 'Admin User' : 'Demo Employee',
        email: `${role.toLowerCase()}@demo.com`,
        password: hashedPassword,
        role: role,
        department: role === 'ADMIN' ? 'Management' : 'Engineering',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
      });
      await user.save();
    }

    user.isOnline = true;
    user.lastActivity = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Demo login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Demo login failed', error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    await User.findByIdAndUpdate(userId, { isOnline: false });

    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
});

// Request Password Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate reset token (6-digit code for simplicity)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Save token and expiry (1 hour)
    await user.update({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: new Date(Date.now() + 3600000)
    });

    // In production, send this via email
    // For now, return it in response (REMOVE IN PRODUCTION)
    res.json({
      success: true,
      message: 'Password reset code generated. In production, this would be sent to your email.',
      resetCode: resetToken, // REMOVE THIS IN PRODUCTION
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request', error: error.message });
  }
});

// Verify Reset Code and Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, reset code, and new password are required' });
    }

    // Hash the provided reset code
    const resetTokenHash = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      where: {
        email: email,
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
});

// Change Password (for logged-in users)
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
  }
});

module.exports = router;
