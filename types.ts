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

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum LeaveType {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  EMERGENCY = 'EMERGENCY',
  PERSONAL = 'PERSONAL',
  ANNUAL = 'ANNUAL',
  OTHER = 'OTHER'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
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

export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  budget: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  teamLeadId?: string;
  createdBy: string;
  priority: ProjectPriority;
  progress: number;
  totalCosts?: number;
  totalPayments?: number;
  pendingAmount?: number;
}

export interface ProjectCost {
  id: string;
  projectId: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: string;
}

export interface ProjectPayment {
  id: string;
  projectId: string;
  amount: number;
  paymentDate: string;
  dueDate?: string;
  paymentMethod: string;
  status: string;
  invoiceNumber?: string;
}

export interface ProjectTimeline {
  id: string;
  projectId: string;
  milestoneName: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  status: string;
  assignedTo?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalHours: number;
}

export interface Screenshot {
  id: string;
  timestamp: string;
  imageUrl: string;
  activityScore: number;
}

export interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  approvedByAdminId?: number;
  adminNotes?: string;
  approvalDate?: Date;
  isWorkingFromHome: boolean;
  createdAt: Date;
  updatedAt: Date;
  employee?: User;
  approvedByAdmin?: User;
}

export interface LeaveCalendarEvent {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  leaveType: LeaveType;
  status: LeaveStatus;
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
