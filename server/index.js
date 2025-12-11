const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { testConnection, sequelize } = require('./config/database');
const { syncDatabase, Message, User } = require('./models');
const seedUsers = require('./scripts/seedUsers');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const timeEntryRoutes = require('./routes/timeEntries');
const screenshotRoutes = require('./routes/screenshots');
const statsRoutes = require('./routes/stats');
const messageRoutes = require('./routes/messages');
const projectRoutes = require('./routes/projects');
const projectCostsRoutes = require('./routes/projectCosts');
const projectPaymentsRoutes = require('./routes/projectPayments');
const projectTimelinesRoutes = require('./routes/projectTimelines');
const notificationRoutes = require('./routes/notifications');
const leaveRoutes = require('./routes/leaves');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization
const initializeDatabase = async () => {
  const connected = await testConnection();
  if (connected) {
    await syncDatabase(false); // Set to true to force recreate tables
    await seedUsers(); // Seed demo users if database is empty
  } else {
    console.error('Failed to connect to database. Server will not start properly.');
  }
};

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/screenshots', screenshotRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-costs', projectCostsRoutes);
app.use('/api/project-payments', projectPaymentsRoutes);
app.use('/api/project-timelines', projectTimelinesRoutes);
app.use('/api/leaves', leaveRoutes);

// Socket.IO for real-time chat
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user:online', async (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Broadcast updated online users list
    const onlineUserIds = Array.from(onlineUsers.keys());
    io.emit('users:online', onlineUserIds);
  });

  socket.on('message:send', async (data) => {
    try {
      const { userId, message } = data;
      
      const newMessage = await Message.create({
        userId,
        message,
        timestamp: new Date()
      });

      const messageWithUser = await Message.findByPk(newMessage.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar', 'role']
        }]
      });

      // Broadcast to all connected clients
      io.emit('message:new', messageWithUser);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message:error', { error: error.message });
    }
  });

  socket.on('typing:start', (userId) => {
    socket.broadcast.emit('user:typing', userId);
  });

  socket.on('typing:stop', (userId) => {
    socket.broadcast.emit('user:stop-typing', userId);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      const onlineUserIds = Array.from(onlineUsers.keys());
      io.emit('users:online', onlineUserIds);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`💬 Socket.IO ready for real-time chat`);
});

module.exports = app;
