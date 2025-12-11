const express = require('express');
const router = express.Router();
const { ProjectTimeline, User } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all timelines/milestones for a project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const timelines = await ProjectTimeline.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] }],
      order: [['dueDate', 'ASC']]
    });

    res.json({ success: true, timelines });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch timelines', error: error.message });
  }
});

// Create timeline/milestone
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { projectId, milestoneName, description, dueDate, assignedTo, deliverables } = req.body;

    const timeline = await ProjectTimeline.create({
      projectId,
      milestoneName,
      description,
      dueDate,
      assignedTo,
      deliverables,
      status: 'NOT_STARTED'
    });

    const timelineWithUser = await ProjectTimeline.findByPk(timeline.id, {
      include: [{ model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({ success: true, message: 'Milestone created successfully', timeline: timelineWithUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create milestone', error: error.message });
  }
});

// Update timeline status
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, completedDate, description, dueDate, assignedTo } = req.body;

    const timeline = await ProjectTimeline.findByPk(req.params.id);
    if (!timeline) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    await timeline.update({
      status,
      completedDate: status === 'COMPLETED' ? (completedDate || new Date()) : null,
      description,
      dueDate,
      assignedTo
    });

    const updatedTimeline = await ProjectTimeline.findByPk(timeline.id, {
      include: [{ model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] }]
    });

    res.json({ success: true, message: 'Milestone updated successfully', timeline: updatedTimeline });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update milestone', error: error.message });
  }
});

// Delete timeline
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const timeline = await ProjectTimeline.findByPk(req.params.id);
    if (!timeline) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    await timeline.destroy();
    res.json({ success: true, message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete milestone', error: error.message });
  }
});

module.exports = router;
