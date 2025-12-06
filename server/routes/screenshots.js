const express = require('express');
const router = express.Router();
const Screenshot = require('../models/Screenshot');
const { authenticate } = require('../middleware/auth');

// Get all screenshots
router.get('/', authenticate, async (req, res) => {
  try {
    const { userId, timeEntryId, limit = 50 } = req.query;
    let query = {};

    if (userId) query.userId = userId;
    if (timeEntryId) query.timeEntryId = timeEntryId;

    const screenshots = await Screenshot.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, screenshots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch screenshots', error: error.message });
  }
});

// Create screenshot
router.post('/', async (req, res) => {
  try {
    const { userId, timeEntryId, imageUrl, activityScore } = req.body;

    const screenshot = new Screenshot({
      userId,
      timeEntryId,
      imageUrl: imageUrl || `https://picsum.photos/300/200?random=${Date.now()}`,
      activityScore
    });

    await screenshot.save();

    res.status(201).json({ 
      success: true, 
      message: 'Screenshot saved successfully', 
      screenshot 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save screenshot', error: error.message });
  }
});

// Get screenshots for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const screenshots = await Screenshot.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, screenshots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user screenshots', error: error.message });
  }
});

// Delete screenshot
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const screenshot = await Screenshot.findByIdAndDelete(req.params.id);
    if (!screenshot) {
      return res.status(404).json({ success: false, message: 'Screenshot not found' });
    }
    res.json({ success: true, message: 'Screenshot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete screenshot', error: error.message });
  }
});

module.exports = router;
