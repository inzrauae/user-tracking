# 🚀 cPanel Deployment Guide - MySQL Version

## Overview

This application has been converted from MongoDB to MySQL to work with cPanel hosting. You can now deploy both frontend and backend on cPanel.

## Prerequisites

- cPanel hosting account with:
  - MySQL database support
  - Node.js support (via Setup Node.js App)
  - SSH access (optional but recommended)
  - File Manager or FTP access

## Part 1: Database Setup

### Step 1: Create MySQL Database in cPanel

1. Log into your cPanel account
2. Go to **MySQL® Databases**
3. Create a new database:
   - Database Name: `user_tracking` (or your preferred name)
   - Click **Create Database**
4. Create a database user:
   - Username: Choose a username
   - Password: Create a strong password
   - Click **Create User**
5. Add user to database:
   - Select the user and database
   - Grant **ALL PRIVILEGES**
   - Click **Make Changes**

### Step 2: Import Database Schema

1. Go to **phpMyAdmin** in cPanel
2. Select your database from the left sidebar
3. Click **SQL** tab
4. Copy and paste the contents of `server/database/schema.sql`
5. Click **Go** to execute

**OR** via SSH:
```bash
mysql -u your_username -p your_database_name < server/database/schema.sql
```

## Part 2: Backend Deployment

### Step 1: Upload Files

**Via File Manager:**
1. Compress `server` folder to `server.zip`
2. In cPanel File Manager, navigate to your desired directory (e.g., `public_html/api`)
3. Upload `server.zip`
4. Extract the archive
5. Delete `server.zip`

**Via FTP:**
1. Upload entire `server` folder to `/public_html/api/`

**Via SSH (Recommended):**
```bash
cd public_html
mkdir api
cd api
# Upload files using scp or git clone
```

### Step 2: Setup Node.js Application

1. In cPanel, go to **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: Select latest LTS (16.x or higher)
   - **Application mode**: Production
   - **Application root**: Path to your server folder (e.g., `/home/username/public_html/api/server`)
   - **Application URL**: Your subdomain or path (e.g., `api.yourdomain.com`)
   - **Application startup file**: `index.js`
4. Click **Create**

### Step 3: Configure Environment Variables

1. In the Node.js App interface, click **Edit** on your application
2. Add environment variables:

```
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306
PORT=5000
NODE_ENV=production
JWT_SECRET=your-very-secure-random-string-here
FRONTEND_URL=https://yourdomain.com
```

**Important:** Use the database credentials you created in Step 1!

### Step 4: Install Dependencies

**Via cPanel Node.js interface:**
1. Click on **Run NPM Install** button

**OR via SSH:**
```bash
cd /home/username/public_html/api/server
source /home/username/nodevenv/public_html/api/server/16/bin/activate
npm install
```

### Step 5: Start the Application

1. In cPanel Node.js App interface, click **Start** (or **Restart**)
2. Check the status - it should show "Running"

### Step 6: Test the API

Visit your API endpoint:
```
https://api.yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Connected"
}
```

## Part 3: Frontend Deployment

### Step 1: Build Frontend

On your local machine:
```bash
# Update .env with your API URL
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env

# Build for production
npm run build
```

### Step 2: Upload Frontend

1. The build creates a `dist` folder
2. Upload contents of `dist` folder to:
   - `public_html/` (for main domain)
   - OR `public_html/app/` (for subdirectory)

3. Create/edit `.htaccess` in the upload directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Part 4: SSL/HTTPS Setup

### Enable SSL (Recommended)

1. Go to cPanel **SSL/TLS Status**
2. Enable AutoSSL or install Let's Encrypt certificate
3. Update frontend `.env`:
   ```
   VITE_API_URL=https://api.yourdomain.com/api
   ```
4. Rebuild and redeploy frontend

## Part 5: Seed Demo Data (Optional)

### Via SSH:
```bash
cd /home/username/public_html/api/server
source /home/username/nodevenv/public_html/api/server/16/bin/activate
npm run seed
```

### Via phpMyAdmin:
Run these SQL commands:

```sql
-- Create admin user (password: demo123)
INSERT INTO users (name, email, password, role, department, avatar, isOnline)
VALUES (
  'Admin User',
  'admin@demo.com',
  '$2a$10$rB5YFYf5X9yW5v5X9yW5vuB5YFYf5X9yW5v5X9yW5v5X9yW5v5X9y',
  'ADMIN',
  'Management',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  1
);
```

Note: Generate proper bcrypt hash using an online tool or the registration endpoint.

## Configuration Summary

### cPanel MySQL Database:
- Database Name: `username_usertracking`
- Username: `username_dbuser`
- Password: [from cPanel]

### Environment Variables (.env):
```
DB_HOST=localhost
DB_USER=username_dbuser
DB_PASSWORD=your_db_password
DB_NAME=username_usertracking
DB_PORT=3306
JWT_SECRET=super-secret-key-min-32-characters
FRONTEND_URL=https://yourdomain.com
PORT=5000
NODE_ENV=production
```

### Frontend (.env):
```
VITE_API_URL=https://api.yourdomain.com/api
```

## Folder Structure on cPanel

```
/home/username/
├── public_html/
│   ├── api/
│   │   └── server/           # Backend (Node.js)
│   │       ├── config/
│   │       ├── models/
│   │       ├── routes/
│   │       ├── middleware/
│   │       ├── index.js
│   │       ├── package.json
│   │       └── .env
│   │
│   └── [frontend files]      # Built React app
│       ├── index.html
│       ├── assets/
│       └── .htaccess
```

## Troubleshooting

### Database Connection Failed
- Verify DB credentials in `.env`
- Check if database user has ALL PRIVILEGES
- Ensure database exists in phpMyAdmin

### Node.js App Won't Start
- Check error logs in cPanel Node.js App interface
- Verify `index.js` path is correct
- Ensure all dependencies are installed
- Check Node.js version compatibility

### API Returns 500 Error
- Check application logs
- Verify database connection
- Test database directly in phpMyAdmin

### CORS Errors
- Update `FRONTEND_URL` in backend `.env`
- Rebuild and restart Node.js app

### Frontend Shows Blank Page
- Check browser console for errors
- Verify API URL in frontend `.env`
- Check `.htaccess` configuration
- Ensure all files uploaded correctly

## Monitoring & Maintenance

### View Logs:
- cPanel → Node.js App → Click your app → View logs
- Or via SSH: `tail -f /home/username/logs/app.log`

### Restart Application:
- cPanel → Node.js App → Restart button
- Or via SSH: `restart` command in app directory

### Update Application:
```bash
cd /home/username/public_html/api/server
git pull  # if using git
npm install
# Restart via cPanel
```

## Performance Tips

1. **Enable cPanel caching**
2. **Use Cloudflare** for CDN and DDoS protection
3. **Optimize MySQL** with proper indexes (already in schema)
4. **Monitor resource usage** in cPanel
5. **Keep Node.js and npm updated**

## Security Checklist

- [ ] Strong database password
- [ ] Unique JWT_SECRET (minimum 32 characters)
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] Regular backups configured
- [ ] SQL injection prevented (using Sequelize ORM)
- [ ] Password hashing (bcrypt)
- [ ] CORS properly configured

## Support Resources

- **cPanel Documentation**: https://docs.cpanel.net/
- **Node.js Setup**: cPanel → Setup Node.js App → Documentation
- **MySQL**: cPanel → MySQL® Databases → Documentation

## Backup Recommendation

### Database Backup:
```bash
mysqldump -u username -p database_name > backup.sql
```

### File Backup:
```bash
tar -czf backup.tar.gz /home/username/public_html/api/server
```

## Success Criteria

✅ MySQL database created and imported
✅ Node.js application running
✅ API health check returns success
✅ Frontend deployed and accessible
✅ Can login and use all features
✅ SSL/HTTPS enabled
✅ No console errors

---

**Your application is now deployed on cPanel with MySQL!** 🎉

Access your app at: `https://yourdomain.com`
