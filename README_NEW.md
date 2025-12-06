# User Tracking - Full Stack Application

A comprehensive remote team tracking system with time tracking, activity monitoring, task management, and real-time analytics.

## ✨ Features

### 🎯 Core Functionality
- ✅ **Time Tracking** - Start/stop work sessions with automatic duration calculation
- ✅ **Activity Monitoring** - Real-time activity score based on user interactions
- ✅ **Idle Detection** - Automatic pause when no activity detected
- ✅ **Screenshot Tracking** - Proof of work with periodic screenshots (simulated)
- ✅ **Task Management** - Create, assign, and track tasks with priorities
- ✅ **Team Dashboard** - Overview of team activity and status
- ✅ **Analytics** - Weekly activity charts and productivity metrics

### 🔐 Security & Access
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access** - Admin, Employee, Team Leader roles
- ✅ **Password Hashing** - bcrypt encryption for user passwords
- ✅ **Mobile Blocking** - Desktop-only access enforcement
- ✅ **Protected Routes** - API endpoint authorization

## 🛠️ Tech Stack

### Frontend
- React 19, TypeScript, Vite
- Tailwind CSS, Recharts, Lucide React, Axios

### Backend
- Node.js, Express, MongoDB, Mongoose
- JWT, bcryptjs

## 🚀 Quick Start

See **[SETUP.md](SETUP.md)** for detailed installation instructions.

### TL;DR
```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start MongoDB
net start MongoDB

# Seed database (optional)
cd server && npm run seed && cd ..

# Run (use startup script)
.\start.ps1

# Or run manually:
# Terminal 1: cd server && npm run dev
# Terminal 2: npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Installation and setup guide
- **[BACKEND_README.md](BACKEND_README.md)** - Complete API documentation

## 🎮 Demo Login

Click "Login as Admin" or "Login as Employee" for instant access.

Or use seeded accounts:
- admin@demo.com / demo123
- employee@demo.com / demo123

## 📁 Project Structure

```
├── server/              # Backend (Node.js + Express + MongoDB)
├── services/            # API integration
├── components/          # React components
├── App.tsx             # Main app
└── types.ts            # TypeScript types
```

## 🔌 API Overview

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/tasks/*` - Task CRUD operations
- `/api/time-entries/*` - Time tracking
- `/api/screenshots/*` - Screenshot management
- `/api/stats/*` - Analytics & statistics

Full API docs: [BACKEND_README.md](BACKEND_README.md)

## 📦 Deployment

- Frontend → Vercel/Netlify
- Backend → Heroku/Railway
- Database → MongoDB Atlas

## 🐛 Troubleshooting

**MongoDB won't connect:**
```bash
net start MongoDB
```

**Port in use:**
- Change PORT in `server/.env`

**Buttons not working:**
- Clear cache and reload
- Check browser console

More help: [SETUP.md](SETUP.md)

## 📝 License

MIT - Free to use and modify!

---

**Built for remote teams 🚀**
