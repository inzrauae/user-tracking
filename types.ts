export enum UserRole {
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  isOnline: boolean;
  department?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  comments: number;
}

export interface TimeEntry {
  id: string;
  userId: string;
  startTime: string; // ISO String
  endTime?: string; // ISO String
  durationSeconds: number;
  description: string;
}

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  hoursWorked: number;
}

export interface Screenshot {
  id: string;
  timestamp: string;
  imageUrl: string;
  activityScore: number;
}
