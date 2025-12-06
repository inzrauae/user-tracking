# 🚀 QUICK START GUIDE

## Setup Instructions

### Step 1: Install MongoDB (One-time setup)

**Option A: Using Chocolatey (Recommended)**
```powershell
choco install mongodb
```

**Option B: Manual Installation**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB should install as a Windows service

### Step 2: Start MongoDB
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it:
net start MongoDB
```

### Step 3: Install Dependencies

**Backend:**
```powershell
cd server
npm install
```

**Frontend:**
```powershell
# From project root
npm install
```

### Step 4: Run the Application

**Easy Way - Use the startup script:**
```powershell
.\start.ps1
```
This will automatically start both backend and frontend in separate windows.

**Manual Way:**

Terminal 1 (Backend):
```powershell
cd server
npm run dev
```

Terminal 2 (Frontend):
```powershell
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🎮 Using the Application

1. Click "Login as Admin" or "Login as Employee" (demo mode)
2. Start tracking time with the "Start Work" button
3. Create and manage tasks
4. View dashboard statistics
5. Monitor team activity (Admin only)

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env` in root):
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-tracking
JWT_SECRET=your-secret-key-here
```

## 📝 API Testing

Test the backend is working:
```powershell
# Health check
curl http://localhost:5000/api/health

# Demo login
curl -X POST http://localhost:5000/api/auth/demo-login -H "Content-Type: application/json" -d '{\"role\":\"ADMIN\"}'
```

## ⚠️ Troubleshooting

**MongoDB won't start:**
```powershell
# Try running MongoDB manually
mongod --dbpath C:\data\db
```

**Port already in use:**
- Change PORT in `server/.env` for backend
- Change port in `vite.config.ts` for frontend

**CORS errors:**
- Make sure both frontend and backend are running
- Check FRONTEND_URL in `server/.env` matches your frontend URL

**Module not found errors:**
```powershell
# Reinstall dependencies
cd server
Remove-Item node_modules -Recurse -Force
npm install

cd ..
Remove-Item node_modules -Recurse -Force  
npm install
```

## 📦 What's Included

### Backend (Node.js + Express + MongoDB)
- ✅ User authentication with JWT
- ✅ Time tracking API
- ✅ Task management
- ✅ Activity monitoring
- ✅ Screenshot tracking
- ✅ Dashboard statistics
- ✅ Team management

### Frontend (React + TypeScript)
- ✅ Time tracker interface
- ✅ Dashboard with charts
- ✅ Task management UI
- ✅ Team overview
- ✅ Activity monitoring
- ✅ Mobile blocking

## 🎯 Next Steps

1. **Customize**: Update branding and colors
2. **Secure**: Change JWT_SECRET in production
3. **Deploy**: 
   - Frontend → Vercel/Netlify
   - Backend → Heroku/Railway
   - Database → MongoDB Atlas

## 📚 Full Documentation

See `BACKEND_README.md` for complete API documentation and advanced configuration.

---

**Need Help?** Check the troubleshooting section or review the full README.
