const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatar', 'role']
      }],
      order: [['timestamp', 'ASC']],
      limit: 100 // Last 100 messages
    });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'userId and message are required'
      });
    }

    const newMessage = await Message.create({
      userId,
      message,
      timestamp: new Date()
    });

    const messageWithUser = await Message.findByPk(newMessage.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'avatar', 'role']
      }]
    });

    res.status(201).json({
      success: true,
      message: messageWithUser
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create message',
      error: error.message
    });
  }
});

// Delete a message (admin only or message owner)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userRole } = req.body;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only admin or message owner can delete
    if (userRole !== 'ADMIN' && message.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
});

module.exports = router;
