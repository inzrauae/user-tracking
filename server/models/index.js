const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const TimeEntry = require('./TimeEntry');
const Screenshot = require('./Screenshot');
const Message = require('./Message')(sequelize);
const Project = require('./Project');
const ProjectCost = require('./ProjectCost');
const ProjectPayment = require('./ProjectPayment');
const ProjectTimeline = require('./ProjectTimeline');
const ActiveSession = require('./ActiveSession');
const LoginAttempt = require('./LoginAttempt');
const Notification = require('./Notification');
const LeaveRequest = require('./LeaveRequest')(sequelize);

// Define relationships
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });
User.hasMany(TimeEntry, { foreignKey: 'userId' });
User.hasMany(Screenshot, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId' });
User.hasMany(Project, { as: 'createdProjects', foreignKey: 'createdBy' });
User.hasMany(Project, { as: 'ledProjects', foreignKey: 'teamLeadId' });
User.hasMany(ActiveSession, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Task.hasMany(TimeEntry, { foreignKey: 'taskId' });

TimeEntry.belongsTo(User, { foreignKey: 'userId' });
TimeEntry.belongsTo(Task, { foreignKey: 'taskId' });
TimeEntry.hasMany(Screenshot, { foreignKey: 'timeEntryId' });

Screenshot.belongsTo(User, { foreignKey: 'userId' });
Screenshot.belongsTo(TimeEntry, { foreignKey: 'timeEntryId' });

Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Project relationships
Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Project.belongsTo(User, { as: 'teamLead', foreignKey: 'teamLeadId' });
Project.hasMany(ProjectCost, { foreignKey: 'projectId' });
Project.hasMany(ProjectPayment, { foreignKey: 'projectId' });
Project.hasMany(ProjectTimeline, { foreignKey: 'projectId' });

ProjectCost.belongsTo(Project, { foreignKey: 'projectId' });
ProjectPayment.belongsTo(Project, { foreignKey: 'projectId' });
ProjectTimeline.belongsTo(Project, { foreignKey: 'projectId' });

// Session relationships
ActiveSession.belongsTo(User, { foreignKey: 'userId' });

// Leave Request relationships
LeaveRequest.belongsTo(User, { as: 'employee', foreignKey: 'userId' });
LeaveRequest.belongsTo(User, { as: 'approvedByAdmin', foreignKey: 'approvedByAdminId' });
User.hasMany(LeaveRequest, { foreignKey: 'userId' });

// Sync database
const syncDatabase = async (force = false) => {
  try {
    // Don't sync automatically - prevents MySQL "Too many keys" error
    console.log('✅ Using existing database schema');
    return true;
  } catch (error) {
    console.error('❌ Error with database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Task,
  TimeEntry,
  Screenshot,
  Message,
  Project,
  ProjectCost,
  ProjectPayment,
  ProjectTimeline,
  ActiveSession,
  LoginAttempt,
  Notification,
  LeaveRequest,
  syncDatabase
};
