const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectCost = sequelize.define('ProjectCost', {
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
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('DEVELOPMENT', 'DESIGN', 'TESTING', 'INFRASTRUCTURE', 'SUPPORT', 'OTHER'),
    defaultValue: 'DEVELOPMENT'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'project_costs',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = ProjectCost;
