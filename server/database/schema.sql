-- User Tracking Application - MySQL Database Schema
-- For cPanel MySQL Database

-- Create database (if you have permission, otherwise create via cPanel)
-- CREATE DATABASE IF NOT EXISTS user_tracking;
-- USE user_tracking;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'EMPLOYEE', 'TEAM_LEADER') DEFAULT 'EMPLOYEE',
  `department` VARCHAR(100) DEFAULT 'Engineering',
  `avatar` VARCHAR(255) DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  `isOnline` BOOLEAN DEFAULT FALSE,
  `lastActivity` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks table
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED') DEFAULT 'TODO',
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
  `assigneeId` INT NOT NULL,
  `createdBy` INT NOT NULL,
  `dueDate` VARCHAR(20) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assigneeId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_assignee` (`assigneeId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Time Entries table
CREATE TABLE IF NOT EXISTS `time_entries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `startTime` DATETIME NOT NULL,
  `endTime` DATETIME,
  `duration` INT DEFAULT 0 COMMENT 'Duration in seconds',
  `activityScore` INT DEFAULT 100 CHECK (`activityScore` >= 0 AND `activityScore` <= 100),
  `isIdle` BOOLEAN DEFAULT FALSE,
  `idleTime` INT DEFAULT 0 COMMENT 'Idle time in seconds',
  `taskId` INT,
  `date` VARCHAR(20) NOT NULL COMMENT 'Format: YYYY-MM-DD',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE SET NULL,
  INDEX `idx_user` (`userId`),
  INDEX `idx_date` (`date`),
  INDEX `idx_task` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screenshots table
CREATE TABLE IF NOT EXISTS `screenshots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `timeEntryId` INT NOT NULL,
  `imageUrl` VARCHAR(500) NOT NULL,
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `activityScore` INT DEFAULT 0 CHECK (`activityScore` >= 0 AND `activityScore` <= 100),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`timeEntryId`) REFERENCES `time_entries`(`id`) ON DELETE CASCADE,
  INDEX `idx_user` (`userId`),
  INDEX `idx_time_entry` (`timeEntryId`),
  INDEX `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo admin user (password: demo123)
-- Password hash for 'demo123' using bcrypt
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department`, `avatar`, `isOnline`) 
VALUES (
  'Admin User', 
  'admin@demo.com', 
  '$2a$10$XqJ5YKzV5kKZ5X5X5X5X5eB5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X',
  'ADMIN', 
  'Management', 
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 
  TRUE
) ON DUPLICATE KEY UPDATE `name`='Admin User';

-- Note: You'll need to generate proper bcrypt hash for password 'demo123'
-- Or use the application's register endpoint to create users

COMMIT;
