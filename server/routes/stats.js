const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const TimeEntry = require('../models/TimeEntry');
const { authenticate } = require('../middleware/auth');

// Get dashboard statistics
router.get('/dashboard/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date().toISOString().split('T')[0];

    // Get tasks count
    const totalTasks = await Task.countDocuments({ assigneeId: userId });
    const pendingTasks = await Task.countDocuments({ assigneeId: userId, status: { $ne: 'COMPLETED' } });
    const completedTasks = await Task.countDocuments({ assigneeId: userId, status: 'COMPLETED' });

    // Get today's time entries
    const todayEntries = await TimeEntry.find({ userId, date: today });
    const hoursWorked = todayEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;

    // Calculate productivity score
    const avgActivityScore = todayEntries.length > 0
      ? todayEntries.reduce((sum, entry) => sum + entry.activityScore, 0) / todayEntries.length
      : 0;

    res.json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        completedTasks,
        hoursWorked: hoursWorked.toFixed(1),
        productivity: Math.round(avgActivityScore)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

// Get weekly activity data
router.get('/weekly/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const weekData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const entries = await TimeEntry.find({ userId, date: dateString });
      const hours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;

      weekData.push({
        name: days[4 - i],
        hours: parseFloat(hours.toFixed(1))
      });
    }

    res.json({ success: true, weekData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch weekly data', error: error.message });
  }
});

// Get team overview (Admin only)
router.get('/team', authenticate, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const today = new Date().toISOString().split('T')[0];

    const teamData = await Promise.all(users.map(async (user) => {
      const todayEntries = await TimeEntry.find({ userId: user._id, date: today });
      const hoursToday = todayEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
      const activeTasks = await Task.countDocuments({ assigneeId: user._id, status: 'IN_PROGRESS' });

      return {
        id: user._id,
        name: user.name,
        department: user.department,
        avatar: user.avatar,
        isOnline: user.isOnline,
        hoursToday: hoursToday.toFixed(1),
        activeTasks
      };
    }));

    res.json({ success: true, teamData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch team data', error: error.message });
  }
});

module.exports = router;
