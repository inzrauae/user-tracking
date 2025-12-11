const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
// Load all models and associations so sequelize knows about every model (including ActiveSession)
const models = require('./models');
const { User, Task } = models;

const seedDatabase = async () => {
  try {
    const ok = await testConnection();
    if (!ok) {
      console.error('❌ Aborting seed: cannot connect to MySQL');
      process.exit(1);
    }

    // Recreate tables. Temporarily disable foreign key checks to avoid drop errors.
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🗄️  Database schema synced (tables recreated)');

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'Management',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        isOnline: true
      },
      {
        name: 'John Doe',
        email: 'employee@demo.com',
        password: hashedPassword,
        role: 'EMPLOYEE',
        department: 'Engineering',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        isOnline: true
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@demo.com',
        password: hashedPassword,
        role: 'EMPLOYEE',
        department: 'Design',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        isOnline: false
      },
      {
        name: 'Mike Chen',
        email: 'mike@demo.com',
        password: hashedPassword,
        role: 'TEAM_LEADER',
        department: 'Engineering',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        isOnline: true
      }
    ];

    const createdUsers = await User.bulkCreate(users, { returning: true });
    console.log(`✅ Created ${createdUsers.length} demo users`);

    // Create demo tasks
    const tasks = [
      {
        title: 'Design new landing page',
        description: 'Create mockups for the new product landing page',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: createdUsers[1].id,
        createdBy: createdUsers[0].id,
        dueDate: '2025-12-10'
      },
      {
        title: 'Fix authentication bug',
        description: 'Users reporting issues with login on mobile devices',
        status: 'TODO',
        priority: 'URGENT',
        assigneeId: createdUsers[1].id,
        createdBy: createdUsers[0].id,
        dueDate: '2025-12-08'
      },
      {
        title: 'Update documentation',
        description: 'Add API documentation for new endpoints',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        assigneeId: createdUsers[3].id,
        createdBy: createdUsers[0].id,
        dueDate: '2025-12-05'
      },
      {
        title: 'Database optimization',
        description: 'Optimize queries for better performance',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: createdUsers[3].id,
        createdBy: createdUsers[0].id,
        dueDate: '2025-12-15'
      },
      {
        title: 'User testing session',
        description: 'Conduct user testing for new features',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: createdUsers[2].id,
        createdBy: createdUsers[0].id,
        dueDate: '2025-12-12'
      }
    ];

    const createdTasks = await Task.bulkCreate(tasks);
    console.log(`✅ Created ${createdTasks.length} demo tasks`);

    console.log('\n📊 Demo Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Users:');
    createdUsers.forEach(user => {
      console.log(`  • ${user.name} (${user.role}) - ${user.email}`);
    });
    console.log('\nPassword for all users: demo123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await sequelize.close();
    console.log('✅ Disconnected from MySQL');
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
