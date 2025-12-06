const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Screenshot = sequelize.define('Screenshot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  timeEntryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'time_entries',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activityScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'screenshots',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Screenshot;
