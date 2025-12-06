# User Tracking Application - Full Stack

A complete remote team tracking application with time tracking, activity monitoring, and task management.

## 🏗️ Project Structure

```
user-tracking/
├── server/              # Backend (Node.js + Express + MongoDB)
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication middleware
│   ├── index.js        # Server entry point
│   └── package.json    # Backend dependencies
├── services/           # Frontend API integration
├── components/         # React components
├── App.tsx            # Main React app
└── package.json       # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

**1. Install MongoDB (if not already installed)**

Windows:
```powershell
# Download from: https://www.mongodb.com/try/download/community
# Or use chocolatey:
choco install mongodb
```

**2. Start MongoDB**
```powershell
# Start MongoDB service
net start MongoDB
# Or run manually:
mongod --dbpath C:\data\db
```

**3. Install Backend Dependencies**
```powershell
cd server
npm install
```

**4. Install Frontend Dependencies**
```powershell
# From project root
npm install
```

**5. Configure Environment Variables**

Create `server/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/user-tracking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

The `.env` file in root directory is already configured for the frontend.

### Running the Application

**Option 1: Run Both (Recommended)**

Terminal 1 - Backend:
```powershell
cd server
npm run dev
```

Terminal 2 - Frontend:
```powershell
npm run dev
```

**Option 2: Run Separately**

Backend only:
```powershell
npm run server
```

Frontend only:
```powershell
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/demo-login` - Demo login (for testing)
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/activity` - Update activity status
- `DELETE /api/users/:id` - Delete user

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Time Entries
- `GET /api/time-entries` - Get all time entries
- `GET /api/time-entries/active/:userId` - Get active entry
- `POST /api/time-entries/start` - Start time tracking
- `PUT /api/time-entries/:id` - Update time entry
- `POST /api/time-entries/stop/:id` - Stop time tracking
- `GET /api/time-entries/summary/:userId` - Get daily summary

### Screenshots
- `GET /api/screenshots` - Get all screenshots
- `GET /api/screenshots/user/:userId` - Get user screenshots
- `POST /api/screenshots` - Create screenshot
- `DELETE /api/screenshots/:id` - Delete screenshot

### Statistics
- `GET /api/stats/dashboard/:userId` - Dashboard stats
- `GET /api/stats/weekly/:userId` - Weekly activity data
- `GET /api/stats/team` - Team overview

## 🔧 Features

### Implemented Features
✅ User authentication (JWT)
✅ Role-based access (Admin, Employee)
✅ Time tracking with start/stop
✅ Idle detection and monitoring
✅ Activity score calculation
✅ Screenshot tracking
✅ Task management
✅ Dashboard statistics
✅ Weekly activity charts
✅ Team management (Admin)
✅ Real-time online status

### Security Features
✅ Password hashing (bcrypt)
✅ JWT authentication
✅ Protected API routes
✅ CORS configuration
✅ Mobile device blocking

## 🧪 Testing

Use the demo login feature:
- Admin: Click "Login as Admin"
- Employee: Click "Login as Employee"

Or register a new account through the registration endpoint.

## 📝 Database Schema

### User
- name, email, password (hashed)
- role (ADMIN, EMPLOYEE, TEAM_LEADER)
- department, avatar
- isOnline, lastActivity

### Task
- title, description
- status (TODO, IN_PROGRESS, COMPLETED)
- priority (LOW, MEDIUM, HIGH, URGENT)
- assigneeId, createdBy, dueDate

### TimeEntry
- userId, taskId
- startTime, endTime, duration
- activityScore, isIdle, idleTime
- date

### Screenshot
- userId, timeEntryId
- imageUrl, timestamp
- activityScore

## 🌐 Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `net start MongoDB`
- Check connection string in `server/.env`

**Port Already in Use:**
- Change PORT in `server/.env` (backend)
- Change port in vite config (frontend)

**CORS Errors:**
- Verify FRONTEND_URL in `server/.env` matches your frontend URL

## 📦 Production Deployment

1. Build frontend:
```powershell
npm run build
```

2. Update environment variables for production
3. Use a process manager like PM2 for the backend
4. Use MongoDB Atlas for cloud database
5. Deploy to Vercel (frontend) + Heroku/Railway (backend)

## 🤝 Contributing

This is a demo application. Feel free to fork and modify for your needs.

## 📄 License

MIT License
