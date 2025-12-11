const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoginAttempt = sequelize.define('LoginAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  deviceId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Reason for failure (e.g., "Invalid credentials", "Mobile login restricted")'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isMobile: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'login_attempts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = LoginAttempt;
