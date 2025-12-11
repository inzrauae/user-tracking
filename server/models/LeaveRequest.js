const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
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
    leaveType: {
      type: DataTypes.ENUM('CASUAL', 'SICK', 'EMERGENCY', 'PERSONAL', 'ANNUAL', 'OTHER'),
      allowNull: false,
      defaultValue: 'CASUAL'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numberOfDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    approvedByAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isWorkingFromHome: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'leave_requests',
    timestamps: true
  });

  return LeaveRequest;
};
