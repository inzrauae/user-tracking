import { Task, TaskPriority, TaskStatus, User, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@company.com',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/100/100?random=1',
    isOnline: true,
    department: 'Management'
  },
  {
    id: 'u2',
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    role: UserRole.LEADER,
    avatar: 'https://picsum.photos/100/100?random=2',
    isOnline: true,
    department: 'Development'
  },
  {
    id: 'u3',
    name: 'Mike Brown',
    email: 'mike@company.com',
    role: UserRole.EMPLOYEE,
    avatar: 'https://picsum.photos/100/100?random=3',
    isOnline: false,
    department: 'Design'
  },
  {
    id: 'u4',
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: UserRole.EMPLOYEE,
    avatar: 'https://picsum.photos/100/100?random=4',
    isOnline: true,
    department: 'Development'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Update Landing Page Hero',
    description: 'Implement new design from Figma with animations.',
    assigneeId: 'u4',
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS,
    dueDate: '2023-11-25',
    comments: 3
  },
  {
    id: 't2',
    title: 'Fix Login API Latency',
    description: 'Investigate slow response times on auth endpoints.',
    assigneeId: 'u2',
    priority: TaskPriority.URGENT,
    status: TaskStatus.TODO,
    dueDate: '2023-11-20',
    comments: 5
  },
  {
    id: 't3',
    title: 'Q4 Marketing Report',
    description: 'Compile analytics from Google Analytics and CRM.',
    assigneeId: 'u3',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.COMPLETED,
    dueDate: '2023-11-15',
    comments: 0
  },
  {
    id: 't4',
    title: 'Design System Update',
    description: 'Update color tokens in the design system.',
    assigneeId: 'u3',
    priority: TaskPriority.LOW,
    status: TaskStatus.REVIEW,
    dueDate: '2023-11-28',
    comments: 1
  }
];
