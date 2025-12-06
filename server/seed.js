const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-tracking';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

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

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} demo users`);

    // Create demo tasks
    const tasks = [
      {
        title: 'Design new landing page',
        description: 'Create mockups for the new product landing page',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: createdUsers[1]._id,
        createdBy: createdUsers[0]._id,
        dueDate: '2025-12-10'
      },
      {
        title: 'Fix authentication bug',
        description: 'Users reporting issues with login on mobile devices',
        status: 'TODO',
        priority: 'URGENT',
        assigneeId: createdUsers[1]._id,
        createdBy: createdUsers[0]._id,
        dueDate: '2025-12-08'
      },
      {
        title: 'Update documentation',
        description: 'Add API documentation for new endpoints',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        assigneeId: createdUsers[3]._id,
        createdBy: createdUsers[0]._id,
        dueDate: '2025-12-05'
      },
      {
        title: 'Database optimization',
        description: 'Optimize queries for better performance',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: createdUsers[3]._id,
        createdBy: createdUsers[0]._id,
        dueDate: '2025-12-15'
      },
      {
        title: 'User testing session',
        description: 'Conduct user testing for new features',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: createdUsers[2]._id,
        createdBy: createdUsers[0]._id,
        dueDate: '2025-12-12'
      }
    ];

    const createdTasks = await Task.insertMany(tasks);
    console.log(`✅ Created ${createdTasks.length} demo tasks`);

    console.log('\n📊 Demo Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Users:');
    createdUsers.forEach(user => {
      console.log(`  • ${user.name} (${user.role}) - ${user.email}`);
    });
    console.log('\nPassword for all users: demo123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
