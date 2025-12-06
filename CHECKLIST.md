# 🚀 GET STARTED CHECKLIST

Copy this checklist and mark items as you complete them!

## Installation Checklist

### Prerequisites
- [ ] Node.js installed (v16 or higher)
- [ ] MongoDB installed
- [ ] Git installed (if cloning repo)

### One-Time Setup

#### 1. Install Dependencies
- [ ] Run `npm install` in project root
- [ ] Run `cd server && npm install` for backend
- [ ] Verify axios is installed: `npm list axios`

#### 2. MongoDB Setup
- [ ] MongoDB installed
- [ ] MongoDB service configured
- [ ] Can start MongoDB: `net start MongoDB`
- [ ] MongoDB running on port 27017

#### 3. Environment Configuration
- [ ] File `.env` exists in project root
- [ ] File `server/.env` exists
- [ ] `VITE_API_URL` set to `http://localhost:5000/api`
- [ ] `MONGODB_URI` set correctly in server/.env

#### 4. Database Seeding (Optional)
- [ ] Run `cd server && npm run seed`
- [ ] Demo users created successfully
- [ ] Demo tasks created successfully

## Daily Startup Checklist

### Quick Start (Automated)
- [ ] MongoDB is running: `net start MongoDB`
- [ ] Run startup script: `.\start.ps1`
- [ ] Backend opens on port 5000
- [ ] Frontend opens on port 3000
- [ ] Can access http://localhost:3000

### Manual Start (Alternative)
- [ ] MongoDB is running
- [ ] Terminal 1: `cd server && npm run dev`
- [ ] Backend shows "Server running on port 5000"
- [ ] Backend shows "MongoDB connected successfully"
- [ ] Terminal 2: `npm run dev`
- [ ] Frontend shows "Local: http://localhost:3000"

## Testing Checklist

### Backend Tests
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Returns `{"status":"OK"}`
- [ ] Can access http://localhost:5000/api in browser
- [ ] No CORS errors in browser console

### Frontend Tests
- [ ] Can access http://localhost:3000
- [ ] Login screen appears
- [ ] "Login as Admin" button works
- [ ] "Login as Employee" button works
- [ ] Dashboard loads after login
- [ ] No console errors

### Feature Tests
- [ ] Time tracker "Start Work" button works
- [ ] Timer counts up
- [ ] Activity score updates
- [ ] Idle detection triggers after 15 seconds
- [ ] "I'm Back" button appears when idle
- [ ] "Stop Work" button works
- [ ] Navigation between tabs works
- [ ] Can view tasks
- [ ] Team status shows users
- [ ] Charts render correctly

## Troubleshooting Checklist

### If Backend Won't Start
- [ ] MongoDB service is running: `Get-Service MongoDB`
- [ ] Port 5000 is not in use
- [ ] All dependencies installed: `cd server && npm install`
- [ ] .env file exists in server directory
- [ ] Check error messages in terminal

### If Frontend Won't Start
- [ ] Port 3000 is not in use
- [ ] All dependencies installed: `npm install`
- [ ] .env file exists in root directory
- [ ] No syntax errors in code
- [ ] Node modules folder exists

### If MongoDB Won't Connect
- [ ] MongoDB service running: `net start MongoDB`
- [ ] MongoDB URI correct: `mongodb://localhost:27017/user-tracking`
- [ ] MongoDB listening on port 27017
- [ ] Firewall not blocking connection

### If Buttons Don't Work
- [ ] No JavaScript errors in console (F12)
- [ ] Backend is running and accessible
- [ ] Frontend can reach backend API
- [ ] No CORS errors
- [ ] Browser cache cleared

### If API Calls Fail
- [ ] Backend is running
- [ ] Correct API URL in .env
- [ ] CORS configured correctly
- [ ] JWT token present (if required)
- [ ] Network tab shows requests

## Documentation Checklist

### Files to Read
- [ ] Read QUICK_REFERENCE.txt for commands
- [ ] Read SETUP.md for installation details
- [ ] Read BACKEND_README.md for API docs
- [ ] Read FINAL_SUMMARY.md for overview
- [ ] Bookmark documentation files

## Production Checklist (When Ready)

### Security
- [ ] Change JWT_SECRET in production
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Set strong passwords
- [ ] Configure CORS for production domain

### Database
- [ ] Use MongoDB Atlas or cloud database
- [ ] Configure database backups
- [ ] Set up monitoring
- [ ] Create indexes for performance

### Deployment
- [ ] Build frontend: `npm run build`
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Heroku/Railway
- [ ] Update environment variables
- [ ] Test production deployment

---

## Quick Command Reference

```powershell
# Start MongoDB
net start MongoDB

# Seed database
cd server && npm run seed

# Run everything (automated)
.\start.ps1

# Run manually
# Terminal 1:
cd server && npm run dev

# Terminal 2:
npm run dev

# Test backend
curl http://localhost:5000/api/health

# Check MongoDB status
Get-Service MongoDB
```

---

**Save this checklist and use it every time you start working on the project!**

Happy coding! 🎉
