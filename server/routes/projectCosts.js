const express = require('express');
const router = express.Router();
const { ProjectCost, User } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all costs for a project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const costs = await ProjectCost.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, as: 'approver', attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']]
    });

    res.json({ success: true, costs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch costs', error: error.message });
  }
});

// Create cost
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { projectId, description, category, amount, date } = req.body;

    const cost = await ProjectCost.create({
      projectId,
      description,
      category: category || 'DEVELOPMENT',
      amount,
      date: date || new Date(),
      status: 'PENDING'
    });

    res.status(201).json({ success: true, message: 'Cost added successfully', cost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add cost', error: error.message });
  }
});

// Update cost status
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, approvedBy } = req.body;

    const cost = await ProjectCost.findByPk(req.params.id);
    if (!cost) {
      return res.status(404).json({ success: false, message: 'Cost not found' });
    }

    await cost.update({ status, approvedBy: status === 'APPROVED' ? approvedBy || req.user.userId : null });

    res.json({ success: true, message: 'Cost updated successfully', cost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cost', error: error.message });
  }
});

// Delete cost
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const cost = await ProjectCost.findByPk(req.params.id);
    if (!cost) {
      return res.status(404).json({ success: false, message: 'Cost not found' });
    }

    await cost.destroy();
    res.json({ success: true, message: 'Cost deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete cost', error: error.message });
  }
});

module.exports = router;
