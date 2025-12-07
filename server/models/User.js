const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'EMPLOYEE', 'TEAM_LEADER'),
    defaultValue: 'EMPLOYEE'
  },
  department: {
    type: DataTypes.STRING(100),
    defaultValue: 'Engineering'
  },
  avatar: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  bankAccountNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ifscCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = User;
