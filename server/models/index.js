const { sequelize } = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const TimeEntry = require('./TimeEntry');
const Screenshot = require('./Screenshot');
const Message = require('./Message')(sequelize);

// Define relationships
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });
User.hasMany(TimeEntry, { foreignKey: 'userId' });
User.hasMany(Screenshot, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId' });

Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Task.hasMany(TimeEntry, { foreignKey: 'taskId' });

TimeEntry.belongsTo(User, { foreignKey: 'userId' });
TimeEntry.belongsTo(Task, { foreignKey: 'taskId' });
TimeEntry.hasMany(Screenshot, { foreignKey: 'timeEntryId' });

Screenshot.belongsTo(User, { foreignKey: 'userId' });
Screenshot.belongsTo(TimeEntry, { foreignKey: 'timeEntryId' });

Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
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
  syncDatabase
};
