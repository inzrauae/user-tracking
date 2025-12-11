const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActiveSession = sequelize.define('ActiveSession', {
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
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  deviceId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Unique device fingerprint'
  },
  deviceName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Device name/model'
  },
  browserName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Browser name (Chrome, Firefox, Safari, etc.)'
  },
  osName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Operating system (Windows, MacOS, Linux, iOS, Android)'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'IPv4 or IPv6 address'
  },
  isMobile: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Is this a mobile device?'
  },
  isTablet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Is this a tablet device?'
  },
  loginTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastActivityTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INVALIDATED', 'EXPIRED'),
    defaultValue: 'ACTIVE'
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Reason for invalidation (e.g., "New login from another device")'
  }
}, {
  tableName: 'active_sessions',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = ActiveSession;
