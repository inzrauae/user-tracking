# 🚀 Quick Start with MySQL

## Prerequisites
- Node.js v16+
- MySQL v5.7+ or MariaDB v10.2+

## Setup Steps

### 1. Install MySQL

**Windows:**
```powershell
# Via Chocolatey
choco install mysql

# Or download installer from:
# https://dev.mysql.com/downloads/installer/
```

**Alternative:** Use XAMPP (includes MySQL + phpMyAdmin)
- Download: https://www.apachefriends.org/
- Install and start MySQL from XAMPP Control Panel

### 2. Create Database

**Option A: Via MySQL Command Line**
```bash
mysql -u root -p
CREATE DATABASE user_tracking;
EXIT;
```

**Option B: Via phpMyAdmin** (if using XAMPP)
1. Open http://localhost/phpmyadmin
2. Click "New" to create database
3. Name it `user_tracking`
4. Click "Create"

**Option C: Let Sequelize auto-create tables**
- Just create the database, tables will be auto-created on first run

### 3. Configure Environment

Edit `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=user_tracking
DB_PORT=3306
```

**For XAMPP:** Usually no password needed:
```env
DB_PASSWORD=
```

### 4. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 5. Start Application

**Option 1: Use startup script (Windows)**
```powershell
.\start-mysql.ps1
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 6. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## First Time Setup

### Import Database Schema (Optional)

If you want pre-defined tables with indexes:

**Via MySQL Command:**
```bash
mysql -u root -p user_tracking < server/database/schema.sql
```

**Via phpMyAdmin:**
1. Select `user_tracking` database
2. Click "SQL" tab
3. Copy contents of `server/database/schema.sql`
4. Click "Go"

**Note:** This step is optional. Sequelize will auto-create tables when you start the server.

### Seed Demo Data (Optional)

```bash
cd server
npm run seed
```

This creates:
- Admin user (admin@demo.com / demo123)
- Employee user (employee@demo.com / demo123)
- Sample tasks

## Troubleshooting

### "Cannot connect to MySQL"
```powershell
# Check if MySQL is running
Get-Service MySQL*

# Start MySQL
net start MySQL80  # or MySQL57, depending on version

# For XAMPP, use XAMPP Control Panel
```

### "Access denied for user"
- Check password in `.env`
- Default XAMPP password is empty
- Try resetting MySQL password

### "Database doesn't exist"
```sql
CREATE DATABASE user_tracking;
```

### "ER_NOT_SUPPORTED_AUTH_MODE"
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## Verify Installation

1. Start backend:
   ```bash
   cd server
   npm run dev
   ```

2. Look for these messages:
   ```
   ✅ MySQL database connected successfully
   ✅ Database synchronized successfully
   🚀 Server running on port 5000
   ```

3. Test API:
   ```bash
   curl http://localhost:5000/api/health
   ```

4. Expected response:
   ```json
   {
     "status": "OK",
     "message": "Server is running"
   }
   ```

## Default Credentials

After seeding:
- **Admin**: admin@demo.com / demo123
- **Employee**: employee@demo.com / demo123

Or use the "Login as Admin" / "Login as Employee" buttons in the UI.

## Next Steps

- ✅ Test all features in the UI
- ✅ Create your own users
- ✅ Deploy to cPanel (see CPANEL_DEPLOYMENT.md)

---

**Need help?** Check MYSQL_MIGRATION.md for detailed migration info.
