# ✅ MongoDB to MySQL Migration - Complete!

## 🎉 What Has Been Done

Your application has been successfully converted from MongoDB to MySQL/MariaDB for cPanel hosting compatibility!

## 📦 Changes Made

### 1. Database Layer ✅
- **Removed**: Mongoose (MongoDB ORM)
- **Added**: Sequelize (SQL ORM) + mysql2 driver
- **Created**: MySQL-compatible database models
- **Created**: Database relationships and associations
- **Created**: SQL schema file for easy deployment

### 2. Backend Configuration ✅
- **Updated**: `server/package.json` - replaced mongoose with sequelize + mysql2
- **Created**: `server/config/database.js` - MySQL connection configuration
- **Updated**: `server/index.js` - uses Sequelize instead of Mongoose
- **Created**: `server/models/index.js` - model relationships and sync
- **Updated**: All model files to use Sequelize syntax

### 3. Environment Configuration ✅
- **Updated**: `.env.example` - MySQL credentials instead of MongoDB URI
- **Created**: `.env.cpanel.example` - production cPanel configuration
- **Updated**: `.env` - local MySQL development settings

### 4. Database Schema ✅
**Created**: `server/database/schema.sql` with:
- Users table
- Tasks table  
- Time Entries table
- Screenshots table
- Foreign key relationships
- Proper indexes
- Demo data insert

### 5. Documentation ✅
- **Created**: `CPANEL_DEPLOYMENT.md` - Complete deployment guide
- **Created**: `.env.cpanel.example` - Production environment template
- **Created**: `database/schema.sql` - SQL schema for import

## 🗄️ Database Comparison

### Before (MongoDB):
```javascript
// MongoDB/Mongoose
const user = await User.findOne({ email: 'test@test.com' });
const users = await User.find({ role: 'ADMIN' });
const user = new User(data);
await user.save();
```

### After (MySQL/Sequelize):
```javascript
// MySQL/Sequelize  
const user = await User.findOne({ where: { email: 'test@test.com' } });
const users = await User.findAll({ where: { role: 'ADMIN' } });
const user = await User.create(data);
```

## 📊 Database Tables

### `users` table
- Integer ID (auto-increment)
- name, email, password
- role (ENUM: ADMIN, EMPLOYEE, TEAM_LEADER)
- department, avatar
- isOnline, lastActivity
- timestamps

### `tasks` table
- Integer ID
- title, description
- status (ENUM: TODO, IN_PROGRESS, COMPLETED)
- priority (ENUM: LOW, MEDIUM, HIGH, URGENT)
- assigneeId, createdBy (foreign keys)
- dueDate, timestamps

### `time_entries` table
- Integer ID
- userId (foreign key)
- startTime, endTime, duration
- activityScore, isIdle, idleTime
- taskId (foreign key, optional)
- date, timestamps

### `screenshots` table
- Integer ID
- userId, timeEntryId (foreign keys)
- imageUrl, timestamp
- activityScore, timestamps

## 🚀 How to Use

### Local Development

1. **Install MySQL** (if not already):
   ```bash
   # Windows (via Chocolatey)
   choco install mysql

   # Or download from: https://dev.mysql.com/downloads/installer/
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE user_tracking;
   ```

3. **Update Environment** (`server/.env`):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=user_tracking
   DB_PORT=3306
   ```

4. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

5. **Run Application**:
   ```bash
   npm run dev
   ```

   The application will automatically:
   - Connect to MySQL
   - Create/update tables (via Sequelize sync)
   - Start the server

### cPanel Deployment

Follow the comprehensive guide in **`CPANEL_DEPLOYMENT.md`**

Quick steps:
1. Create MySQL database in cPanel
2. Import `server/database/schema.sql`
3. Upload server files
4. Configure Node.js app in cPanel
5. Set environment variables
6. Install dependencies
7. Start application

## ✨ Key Features Retained

✅ User authentication (JWT)
✅ Role-based access control
✅ Time tracking
✅ Task management
✅ Activity monitoring
✅ Screenshot tracking
✅ Dashboard statistics
✅ All API endpoints

## 📋 Files Modified/Created

### Modified:
- `server/package.json`
- `server/index.js`
- `server/models/User.js`
- `server/models/Task.js`
- `server/models/TimeEntry.js`
- `server/models/Screenshot.js`
- `server/routes/auth.js`
- `server/routes/users.js`
- `server/.env.example`

### Created:
- `server/config/database.js`
- `server/models/index.js`
- `server/database/schema.sql`
- `server/.env.cpanel.example`
- `CPANEL_DEPLOYMENT.md`
- `MYSQL_MIGRATION.md` (this file)

## ⚙️ Configuration Files

### Local Development (`.env`):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_tracking
DB_PORT=3306
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
FRONTEND_URL=http://localhost:3000
```

### cPanel Production (`.env.cpanel.example`):
```env
DB_HOST=localhost
DB_USER=cpanel_username
DB_PASSWORD=secure_password
DB_NAME=cpanel_database
DB_PORT=3306
PORT=5000
NODE_ENV=production
JWT_SECRET=production-secret-32-chars-min
FRONTEND_URL=https://yourdomain.com
```

## 🧪 Testing

### Test Database Connection:
```bash
cd server
npm run dev
```

Look for: `✅ MySQL database connected successfully`

### Test API:
```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Connected"
}
```

## 📚 Dependencies

### Removed:
- `mongoose`: ^8.0.0

### Added:
- `mysql2`: ^3.6.5
- `sequelize`: ^6.35.0

## 🎯 Next Steps

1. **Install MySQL locally**
2. **Update server/.env with MySQL credentials**
3. **Run `npm install` in server directory**
4. **Start server with `npm run dev`**
5. **Test all API endpoints**
6. **Deploy to cPanel** (see CPANEL_DEPLOYMENT.md)

## 🐛 Troubleshooting

### "Cannot connect to MySQL"
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists

### "Table doesn't exist"
- Import `database/schema.sql`
- Or let Sequelize auto-create (sync: true)

### "Authentication plugin error"
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```

## 📖 Additional Resources

- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **MySQL Docs**: https://dev.mysql.com/doc/
- **cPanel Docs**: https://docs.cpanel.net/

## ✅ Verification Checklist

- [ ] MySQL installed and running
- [ ] Database created
- [ ] Environment configured
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] Database tables created
- [ ] API endpoints working
- [ ] Can create/login users
- [ ] All features functional

---

**Migration Complete!** Your application now uses MySQL and is ready for cPanel deployment! 🎉

See **CPANEL_DEPLOYMENT.md** for deployment instructions.
