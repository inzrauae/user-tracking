const express = require('express');
const router = express.Router();
const { Project, ProjectCost, ProjectPayment, ProjectTimeline, User } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all projects
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'teamLead', attributes: ['id', 'name', 'email'] },
        { model: ProjectCost, attributes: ['id', 'amount', 'category'] },
        { model: ProjectPayment, attributes: ['id', 'amount', 'status'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate totals for each project
    const projectsWithTotals = projects.map(project => {
      const totalCosts = project.ProjectCosts.reduce((sum, cost) => sum + parseFloat(cost.amount), 0);
      const totalPayments = project.ProjectPayments.reduce((sum, payment) => 
        payment.status === 'COMPLETED' ? sum + parseFloat(payment.amount) : sum, 0);
      const pendingAmount = parseFloat(project.budget) - totalPayments;

      return {
        ...project.toJSON(),
        totalCosts,
        totalPayments,
        pendingAmount
      };
    });

    res.json({ success: true, projects: projectsWithTotals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
  }
});

// Get project by ID with details
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'teamLead', attributes: ['id', 'name', 'email'] },
        { model: ProjectCost },
        { model: ProjectPayment },
        { model: ProjectTimeline }
      ]
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const totalCosts = project.ProjectCosts.reduce((sum, cost) => sum + parseFloat(cost.amount), 0);
    const totalPayments = project.ProjectPayments.reduce((sum, payment) => 
      payment.status === 'COMPLETED' ? sum + parseFloat(payment.amount) : sum, 0);

    res.json({
      success: true,
      project: {
        ...project.toJSON(),
        totalCosts,
        totalPayments,
        pendingAmount: parseFloat(project.budget) - totalPayments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project', error: error.message });
  }
});

// Create project
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, clientName, budget, startDate, endDate, teamLeadId, priority } = req.body;

    const project = await Project.create({
      name,
      description,
      clientName,
      budget,
      startDate,
      endDate,
      teamLeadId,
      priority: priority || 'MEDIUM',
      createdBy: req.user.userId
    });

    const projectWithUser = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'teamLead', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json({ success: true, message: 'Project created successfully', project: projectWithUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
  }
});

// Update project
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, clientName, budget, status, startDate, endDate, teamLeadId, priority, progress } = req.body;

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.update({ name, description, clientName, budget, status, startDate, endDate, teamLeadId, priority, progress });

    const updatedProject = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'teamLead', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({ success: true, message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project', error: error.message });
  }
});

// Delete project
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.destroy();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project', error: error.message });
  }
});

module.exports = router;
