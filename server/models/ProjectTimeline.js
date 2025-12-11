const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectTimeline = sequelize.define('ProjectTimeline', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  milestoneName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'DELAYED'),
    defaultValue: 'NOT_STARTED'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  deliverables: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Comma-separated list of deliverables'
  }
}, {
  tableName: 'project_timeline',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = ProjectTimeline;
