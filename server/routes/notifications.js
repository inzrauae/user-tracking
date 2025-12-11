const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get notifications for admin
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { unreadOnly = false } = req.query;
    let where = { userId: req.user.userId };

    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.userId, isRead: false }
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, isAdmin, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.update({ isRead: true });

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticate, isAdmin, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.userId, isRead: false } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notifications', error: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.destroy();

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
});

module.exports = router;
