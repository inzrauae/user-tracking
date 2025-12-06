const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');
const { authenticate } = require('../middleware/auth');

// Get all time entries
router.get('/', authenticate, async (req, res) => {
  try {
    const { userId, date, startDate, endDate } = req.query;
    let query = {};

    if (userId) query.userId = userId;
    if (date) query.date = date;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const timeEntries = await TimeEntry.find(query)
      .populate('userId', 'name email avatar')
      .populate('taskId', 'title')
      .sort({ startTime: -1 });

    res.json({ success: true, timeEntries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch time entries', error: error.message });
  }
});

// Get active time entry for user
router.get('/active/:userId', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({
      userId: req.params.userId,
      endTime: null
    }).populate('taskId', 'title');

    res.json({ success: true, timeEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch active time entry', error: error.message });
  }
});

// Start time tracking
router.post('/start', async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    // Check if there's already an active entry
    const existingEntry = await TimeEntry.findOne({ userId, endTime: null });
    if (existingEntry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Time tracking already in progress',
        timeEntry: existingEntry
      });
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];

    const timeEntry = new TimeEntry({
      userId,
      taskId,
      startTime: now,
      date,
      duration: 0
    });

    await timeEntry.save();
    await timeEntry.populate('taskId', 'title');

    res.status(201).json({ 
      success: true, 
      message: 'Time tracking started', 
      timeEntry 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to start time tracking', error: error.message });
  }
});

// Update time entry (for activity tracking)
router.put('/:id', async (req, res) => {
  try {
    const { duration, activityScore, isIdle, idleTime } = req.body;

    const timeEntry = await TimeEntry.findByIdAndUpdate(
      req.params.id,
      { duration, activityScore, isIdle, idleTime },
      { new: true }
    ).populate('taskId', 'title');

    if (!timeEntry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    res.json({ success: true, timeEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update time entry', error: error.message });
  }
});

// Stop time tracking
router.post('/stop/:id', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findById(req.params.id);
    
    if (!timeEntry) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }

    if (timeEntry.endTime) {
      return res.status(400).json({ success: false, message: 'Time tracking already stopped' });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - timeEntry.startTime) / 1000); // in seconds

    timeEntry.endTime = endTime;
    timeEntry.duration = duration;
    await timeEntry.save();
    await timeEntry.populate('taskId', 'title');

    res.json({ 
      success: true, 
      message: 'Time tracking stopped', 
      timeEntry 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to stop time tracking', error: error.message });
  }
});

// Get user's daily summary
router.get('/summary/:userId', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const entries = await TimeEntry.find({
      userId: req.params.userId,
      date: targetDate
    });

    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const avgActivityScore = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + entry.activityScore, 0) / entries.length
      : 0;

    res.json({
      success: true,
      summary: {
        date: targetDate,
        totalDuration,
        avgActivityScore: Math.round(avgActivityScore),
        sessionsCount: entries.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get summary', error: error.message });
  }
});

module.exports = router;
