const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function seedUsers() {
  try {
    // Check if users already exist
    const existingUsers = await User.count();
    
    if (existingUsers > 0) {
      console.log('✅ Users already exist in database');
      return;
    }

    console.log('🌱 Seeding demo users...');

    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Create Admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'ADMIN',
      department: 'Management',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isOnline: true,
      lastActivity: new Date()
    });

    // Create Employee users
    await User.create({
      name: 'John Smith',
      email: 'employee@demo.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
      department: 'Engineering',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      isOnline: true,
      lastActivity: new Date()
    });

    await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@demo.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
      department: 'Design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      isOnline: false,
      lastActivity: new Date(Date.now() - 3600000) // 1 hour ago
    });

    console.log('✅ Demo users created successfully!');
    console.log('📧 Login credentials:');
    console.log('   Admin: admin@demo.com / demo123');
    console.log('   Employee: employee@demo.com / demo123');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

module.exports = seedUsers;

// Run if called directly
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  seedUsers()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
