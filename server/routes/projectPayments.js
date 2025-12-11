const express = require('express');
const router = express.Router();
const { ProjectPayment } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all payments for a project
router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const payments = await ProjectPayment.findAll({
      where: { projectId: req.params.projectId },
      order: [['paymentDate', 'DESC']]
    });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
  }
});

// Create payment
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { projectId, amount, paymentDate, dueDate, paymentMethod, invoiceNumber, notes } = req.body;

    const payment = await ProjectPayment.create({
      projectId,
      amount,
      paymentDate: paymentDate || new Date(),
      dueDate,
      paymentMethod: paymentMethod || 'BANK_TRANSFER',
      invoiceNumber,
      notes,
      status: 'PENDING'
    });

    res.status(201).json({ success: true, message: 'Payment added successfully', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add payment', error: error.message });
  }
});

// Update payment status
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, paymentDate, paymentMethod, notes } = req.body;

    const payment = await ProjectPayment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    await payment.update({ status, paymentDate, paymentMethod, notes });

    res.json({ success: true, message: 'Payment updated successfully', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment', error: error.message });
  }
});

// Delete payment
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const payment = await ProjectPayment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    await payment.destroy();
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete payment', error: error.message });
  }
});

module.exports = router;
