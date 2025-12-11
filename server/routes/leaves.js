const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { LeaveRequest, User } = require('../models');
const { Op } = require('sequelize');

// GET all leave requests (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, userId, startDate, endDate } = req.query;
    const where = {};

    // If user is not admin, only show their own requests
    if (!isAdmin(req)) {
      where.userId = req.user.id;
    } else if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate[Op.gte] = new Date(startDate);
      if (endDate) where.startDate[Op.lte] = new Date(endDate);
    }

    const requests = await LeaveRequest.findAll({
      where,
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] },
        { model: User, as: 'approvedByAdmin', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests',
      error: error.message
    });
  }
});

// GET leave request by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const request = await LeaveRequest.findByPk(req.params.id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] },
        { model: User, as: 'approvedByAdmin', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user can view this request
    if (request.userId !== req.user.id && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave request',
      error: error.message
    });
  }
});

// CREATE new leave request
router.post('/', authenticate, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, numberOfDays, isWorkingFromHome } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: leaveType, startDate, endDate, reason'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Leave start date cannot be in the past'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'Leave end date must be after start date'
      });
    }

    // Calculate number of days
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      userId: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays: numberOfDays || days,
      reason,
      isWorkingFromHome: isWorkingFromHome || false,
      status: 'PENDING'
    });

    // Fetch with associations
    const populated = await LeaveRequest.findByPk(leaveRequest.id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Leave request created successfully',
      request: populated
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create leave request',
      error: error.message
    });
  }
});

// UPDATE leave request status (admin only)
router.put('/:id/approve', [authenticate, isAdmin], async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be APPROVED or REJECTED'
      });
    }

    const request = await LeaveRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of ${request.status} request`
      });
    }

    // Update request
    request.status = status;
    request.approvedByAdminId = req.user.id;
    request.adminNotes = adminNotes || null;
    request.approvalDate = new Date();
    await request.save();

    // Fetch updated request with associations
    const updated = await LeaveRequest.findByPk(req.params.id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] },
        { model: User, as: 'approvedByAdmin', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      request: updated
    });
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update leave request',
      error: error.message
    });
  }
});

// CANCEL leave request (employee can cancel their own pending requests)
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const request = await LeaveRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check authorization
    if (request.userId !== req.user.id && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${request.status} request`
      });
    }

    request.status = 'CANCELLED';
    await request.save();

    const updated = await LeaveRequest.findByPk(req.params.id, {
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'department'] }
      ]
    });

    res.json({
      success: true,
      message: 'Leave request cancelled successfully',
      request: updated
    });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel leave request',
      error: error.message
    });
  }
});

// GET calendar data (leave dates for calendar view)
router.get('/calendar/dates', authenticate, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const where = {
      status: ['APPROVED', 'PENDING'] // Show approved and pending leaves
    };

    // If not admin, only show user's own leaves
    if (!isAdmin(req)) {
      where.userId = req.user.id;
    }

    const requests = await LeaveRequest.findAll({
      where,
      attributes: ['id', 'userId', 'startDate', 'endDate', 'leaveType', 'status'],
      include: [
        { model: User, as: 'employee', attributes: ['id', 'name'] }
      ]
    });

    // Format for calendar
    const leaves = requests.map(req => ({
      id: req.id,
      employeeId: req.userId,
      employeeName: req.employee.name,
      startDate: req.startDate,
      endDate: req.endDate,
      leaveType: req.leaveType,
      status: req.status
    }));

    res.json({
      success: true,
      leaves
    });
  } catch (error) {
    console.error('Error fetching calendar dates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar dates',
      error: error.message
    });
  }
});

// GET leave statistics for user
router.get('/stats/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check authorization
    if (userId != req.user.id && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these stats'
      });
    }

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const stats = await LeaveRequest.findAll({
      where: {
        userId,
        status: 'APPROVED',
        startDate: {
          [Op.between]: [yearStart, yearEnd]
        }
      }
    });

    const totalDays = stats.reduce((sum, req) => sum + req.numberOfDays, 0);
    const byType = {};

    stats.forEach(req => {
      if (!byType[req.leaveType]) {
        byType[req.leaveType] = 0;
      }
      byType[req.leaveType] += req.numberOfDays;
    });

    res.json({
      success: true,
      stats: {
        totalDaysApproved: totalDays,
        byType,
        year: currentYear
      }
    });
  } catch (error) {
    console.error('Error fetching leave stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leave statistics',
      error: error.message
    });
  }
});

module.exports = router;
