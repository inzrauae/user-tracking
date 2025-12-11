# Employee Tracking & Time Management System

A comprehensive web-based application for tracking employee work activities, managing tasks, projects, leaves, and team communications with real-time activity monitoring.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [How to Use](#how-to-use)
- [User Roles](#user-roles)
- [Key Modules](#key-modules)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

---

## ✨ Features

### 👤 User Management
- **Role-based Access Control**: Admin, Team Leader, Employee roles
- **Employee Profiles**: Manage employee information, departments, and bank details
- **Authentication**: Secure JWT-based login with email and password
- **Device Fingerprinting**: Track device information and prevent unauthorized access
- **One-Device Restriction**: Employees can only login from one device at a time

### ⏱️ Time Tracking
- **Activity Timer**: Start/Stop work timer with pause functionality
- **Activity Score**: Real-time calculation based on work duration and productivity
- **Idle Detection**: Automatic detection of idle time periods
- **Screenshots**: Capture proof of work with timestamps
- **Session Management**: Track login/logout sessions per device

### 📊 Dashboard
- **Admin Dashboard**: Overview of all employees, projects, tasks, and activities
- **Employee Dashboard**: Personal time tracking, leave requests, and activity logs
- **Real-time Analytics**: Work hours, productivity metrics, and performance tracking
- **Charts & Statistics**: Visual representation of work data

### 📝 Task Management
- **Task Creation**: Create and assign tasks to employees
- **Status Tracking**: Monitor task progress (To Do, In Progress, Completed)
- **Priority Levels**: Set task priority (Low, Medium, High, Urgent)
- **Due Dates**: Track deadlines and task completion
- **Task Filtering**: Filter tasks by status and priority

### 💼 Project Management
- **Project Creation**: Create and manage multiple projects
- **Team Assignment**: Assign team leads and members to projects
- **Budget Tracking**: Monitor project budgets and pending amounts
- **Project Status**: Track ongoing, completed, and on-hold projects
- **Timeline Management**: Set start and end dates for projects

### 📅 Leave Management
- **Leave Request System**: Employees can request leaves
- **Leave Approval**: Admins can approve or reject leave requests
- **Leave Calendar**: Visual calendar showing approved leaves
- **Leave Types**: Support for different types of leaves (Sick, Casual, Annual, etc.)
- **Balance Tracking**: Monitor remaining leave balance

### 💬 Team Chat
- **Real-time Messaging**: Direct messaging between team members
- **Chat History**: Persistent message storage and retrieval
- **Team Channels**: Communicate with specific teams or groups
- **Message Notifications**: Real-time notifications for new messages

### 📱 Mobile Blocking
- **Smartphone Detection**: Prevents mobile device access
- **Desktop Only**: Application restricted to desktop browsers
- **Device Type Validation**: User-agent based device detection

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useContext)
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Device Parser**: ua-parser-js

### Database
- **Type**: MySQL
- **Schema**: Automated via Sequelize models
- **Tables**: Users, Tasks, Projects, TimeEntries, Messages, Leaves, Screenshots, Sessions

---

## 📁 Project Structure

```
user-tracking/
├── server/                    # Backend application
│   ├── index.js              # Express server entry point
│   ├── package.json          # Server dependencies
│   ├── seed.js               # Database seed script
│   ├── config/
│   │   └── database.js       # MySQL configuration
│   ├── database/
│   │   └── schema.sql        # Database schema
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/               # Sequelize models
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Project.js
│   │   ├── TimeEntry.js
│   │   ├── Message.js
│   │   ├── Screenshot.js
│   │   └── index.js
│   ├── routes/               # API routes
│   │   ├── auth.js           # Login/logout endpoints
│   │   ├── users.js          # User management
│   │   ├── tasks.js          # Task endpoints
│   │   ├── projects.js       # Project endpoints
│   │   ├── timeEntries.js    # Time tracking
│   │   ├── messages.js       # Chat endpoints
│   │   ├── screenshots.js    # Activity screenshots
│   │   └── stats.js          # Analytics/statistics
│   └── scripts/
│       └── seedUsers.js      # Populate test data
│
├── src/                       # Frontend application
│   ├── App.tsx               # Main application component
│   ├── index.tsx             # React entry point
│   ├── types.ts              # TypeScript interfaces
│   ├── services/
│   │   ├── api.ts            # API service/configuration
│   │   └── mockData.ts       # Mock data for development
│   └── components/           # Reusable components
│       ├── Chat.tsx
│       ├── Sidebar.tsx
│       └── TimeTracker.tsx
│
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Frontend dependencies
├── start.ps1                 # PowerShell startup script
└── README.md                 # Documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database** (edit `config/database.js`)
   ```javascript
   {
     host: 'localhost',
     user: 'root',
     password: 'your_password',
     database: 'user_tracking'
   }
   ```

4. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL** (in `services/api.ts`)
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

3. **Start development server**
   ```bash
   npm run dev
   # Application runs on http://localhost:3000
   ```

### Database Setup

1. **Create database**
   ```sql
   CREATE DATABASE user_tracking;
   ```

2. **Run schema** (Optional - Sequelize auto-syncs)
   ```bash
   mysql -u root -p user_tracking < server/database/schema.sql
   ```

3. **Seed test data**
   ```bash
   cd server
   node scripts/seedUsers.js
   ```

---

## 📖 How to Use

### 1. **Login**
- Navigate to http://localhost:3000
- Enter credentials:
  - **Admin**: email: `admin@demo.com` | password: `demo123`
  - **Employee**: email: `employee@demo.com` | password: `demo123`
  - **Team Leader**: email: `teamlead@demo.com` | password: `demo123`
- Select role (defaults based on account type)
- Click "Sign In"

### 2. **Time Tracking (Employee Dashboard)**
1. Click **"Start Timer"** button
2. Application begins tracking work time
3. Press **"Pause"** to pause timer, **"Resume"** to continue
4. Click **"Stop Timer"** to end session
5. Activity screenshots captured automatically
6. View real-time activity score and idle detection

### 3. **Task Management**
1. Go to **Tasks** section
2. Click **"+ New Task"** button
3. Fill in task details:
   - Task title
   - Description
   - Assign to employee
   - Set priority (Low/Medium/High/Urgent)
   - Set due date
4. Click **"Create Task"**
5. View tasks in table, filter by status/priority
6. Click task menu (⋮) for more options

### 4. **Project Management**
1. Navigate to **Projects** section
2. Click **"+ New Project"** button
3. Enter project details:
   - Project name
   - Description
   - Client name
   - Budget
   - Start & End dates
   - Assign team lead
   - Set priority
4. Click **"Create Project"**
5. View all projects and their status

### 5. **Employee Management (Admin Only)**
1. Go to **Team Members** section
2. View all employees in grid/card layout
3. **View Logs**: Click "View Logs" button
   - See employee profile and recent activity
   - Check online status
   - View activity timeline
4. **Settings**: Click Settings (⚙️) button
   - Edit employee name, email, mobile
   - Change department
   - Update role (Employee/Team Leader/Admin)
   - Save changes
5. **Add Employee**: Click "Add Employee" button
   - Enter employee details
   - Set password
   - Add bank account details (optional)
   - Create employee

### 6. **Leave Management**
1. Go to **Leave Calendar** section
2. Click on date to request leave
3. Fill leave request form:
   - Select leave type
   - Choose date range
   - Add reason/notes
4. Submit request
5. Admin reviews and approves/rejects
6. View approved leaves in calendar

### 7. **Team Chat**
1. Open **Messages** section
2. Select employee to message
3. Type message in input box
4. Press Enter or click Send
5. View message history
6. Receive real-time notifications

### 8. **Analytics & Reports**
1. View **Dashboard** with statistics:
   - Total work hours
   - Active employees
   - Ongoing projects
   - Pending tasks
   - Productivity metrics
2. View charts and graphs
3. Export reports (if available)

---

## 👥 User Roles

### 🔐 Admin
- Full access to all features
- Manage employees (Create, Edit, Delete)
- Approve/Reject leave requests
- Create and manage projects
- Assign tasks
- View all analytics and reports
- Access all user data and activities

### 👔 Team Leader
- Manage assigned team members
- Create and assign tasks
- Approve team member leaves
- View team performance metrics
- Track team productivity
- Access team communications

### 👨‍💼 Employee
- Track personal time and activities
- Submit leave requests
- View assigned tasks
- Communicate with team members
- View personal performance metrics
- Cannot manage other employees

---

## 🔧 Key Modules

### Authentication Module (`server/routes/auth.js`)
Handles user login and authentication with JWT tokens.

**Login Endpoint:**
```bash
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: User, session: Session }
```

### Time Tracking Module (`server/models/TimeEntry.js`)
Tracks work hours, idle time, and activity.

**Create Time Entry:**
```bash
POST /api/time-entries
Body: { userId: number, duration: number, activityScore: number }
```

### Task Management Module (`server/routes/tasks.js`)
Create, update, and manage tasks.

**Create Task:**
```bash
POST /api/tasks
Body: { title, description, assigneeId, priority, dueDate }
```

### Leave Management Module
Request and manage employee leaves.

**Request Leave:**
```bash
POST /api/leaves
Body: { userId, startDate, endDate, leaveType, reason }
```

### Chat Module (`server/routes/messages.js`)
Real-time messaging between employees.

**Send Message:**
```bash
POST /api/messages
Body: { senderId, receiverId, content }
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/forgot-password` | Reset password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Time Entries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/time-entries` | Get time entries |
| POST | `/api/time-entries` | Create time entry |
| GET | `/api/time-entries/stats` | Get statistics |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get messages |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/:userId` | Get chat with user |

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('ADMIN', 'TEAM_LEADER', 'EMPLOYEE'),
  department VARCHAR(100),
  mobile VARCHAR(20),
  avatar VARCHAR(255),
  isOnline BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE Tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  assigneeId INT,
  status ENUM('TO_DO', 'IN_PROGRESS', 'COMPLETED'),
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  dueDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (assigneeId) REFERENCES Users(id)
);
```

### TimeEntries Table
```sql
CREATE TABLE TimeEntries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  duration INT,
  activityScore INT,
  idleTime INT,
  screenshotCount INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);
```

### Sessions Table
```sql
CREATE TABLE Sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  deviceInfo JSON,
  loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logoutTime TIMESTAMP,
  isActive BOOLEAN DEFAULT true,
  FOREIGN KEY (userId) REFERENCES Users(id)
);
```

---

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `server/config/database.js`
- Ensure database `user_tracking` exists

### Port Already in Use
```bash
# Kill process on port 5000 (server)
netstat -ano | findstr :5000

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
```

### Login Not Working
- Check server is running: `npm start` in server folder
- Verify test credentials exist
- Check browser console for errors

### Styling Issues
- Clear browser cache
- Rebuild frontend: `npm run build`
- Ensure Tailwind CSS is properly configured

---

## 📝 Environment Variables

Create `.env` file in server folder:
```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=user_tracking
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For issues and questions, contact the development team.

**Last Updated**: December 2025
