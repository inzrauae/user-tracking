import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { User, UserRole, Task, TimeEntry, DashboardStats, Screenshot } from './types';
import Sidebar from './components/Sidebar';
import TimeTracker from './components/TimeTracker';
import Chat from './components/Chat';
import { NotificationCenter } from './components/NotificationCenter';
import { SessionManager } from './components/SessionManager';
import { LeaveCalendar } from './components/LeaveCalendar';
import { LeaveRequestModal } from './components/LeaveRequestModal';
import { LeaveRequestsList } from './components/LeaveRequestsList';
import { MOCK_USERS, MOCK_TASKS } from './services/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Menu, 
  Search, 
  Bell, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Filter,
  Settings,
  BarChart2,
  Smartphone,
  Lock,
  Camera,
  Activity
} from 'lucide-react';

// --- Mobile Block Screen ---
const MobileBlockScreen = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
    <div className="bg-red-500/10 p-6 rounded-full mb-6">
      <Smartphone className="w-16 h-16 text-red-500" />
    </div>
    <h1 className="text-2xl font-bold mb-2">Desktop Access Only</h1>
    <p className="text-slate-400 max-w-sm mb-8">
      To ensure accurate time tracking and activity monitoring, this application is restricted to desktop computers.
    </p>
    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-800 px-4 py-2 rounded-lg">
      <Lock className="w-4 h-4" />
      <span>Security Protocol Active</span>
    </div>
  </div>
);

// --- Login Component ---
const LoginScreen = ({ onLogin, apiUrl }: { onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; apiUrl: string }) => {
  const [loginMode, setLoginMode] = useState<'select' | 'admin' | 'employee' | 'forgot'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code'>('email');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await onLogin(email, password);
    setIsLoading(false);
    
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (resetStep === 'email') {
      try {
        const response = await axios.post(`${apiUrl}/auth/forgot-password`, { email });
        if (response.data.success) {
          setSuccessMessage(`Reset code sent! Code: ${response.data.resetCode}`);
          setResetStep('code');
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to send reset code');
      }
    } else {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/auth/reset-password`, {
          email,
          resetCode,
          newPassword
        });
        if (response.data.success) {
          setSuccessMessage('Password reset successful! You can now login.');
          setTimeout(() => {
            setLoginMode('select');
            setResetStep('email');
            setEmail('');
            setResetCode('');
            setNewPassword('');
            setConfirmPassword('');
          }, 2000);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to reset password');
      }
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = (role: 'admin' | 'employee') => {
    if (role === 'admin') {
      setEmail('admin@demo.com');
      setPassword('demo123');
    } else {
      setEmail('employee@demo.com');
      setPassword('demo123');
    }
  };

  if (loginMode === 'forgot') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <button 
            onClick={() => {
              setLoginMode('select');
              setResetStep('email');
              setEmail('');
              setResetCode('');
              setNewPassword('');
              setConfirmPassword('');
              setError('');
              setSuccessMessage('');
            }}
            className="mb-6 text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm"
          >
            ← Back to login
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img src="/logo-1 (1).png" alt="RemoteSync Logo" className="h-16 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
            <p className="text-slate-500">
              {resetStep === 'email' ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {resetStep === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : resetStep === 'email' ? 'Send Reset Code' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loginMode === 'select') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mx-auto mb-6">
              <img src="/logo-1 (1).png" alt="RemoteSync Logo" className="h-20 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500">Sign in to manage your remote team</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setLoginMode('admin')}
              className="w-full p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group"
            >
              <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Admin Login</p>
                <p className="text-xs text-slate-500">Full access to settings & reports</p>
              </div>
            </button>

            <button 
              onClick={() => setLoginMode('employee')}
              className="w-full p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group"
            >
              <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Employee Login</p>
                <p className="text-xs text-slate-500">Task management & time tracking</p>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            <p>Select login type to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <button 
          onClick={() => {
            setLoginMode('select');
            setEmail('');
            setPassword('');
          }}
          className="mb-6 text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm"
        >
          ← Back to selection
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-6">
            <img src="/logo-1 (1).png" alt="RemoteSync Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {loginMode === 'admin' ? 'Admin Login' : 'Employee Login'}
          </h1>
          <p className="text-slate-500">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <button 
              type="button" 
              onClick={() => setLoginMode('forgot')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              loginMode === 'admin' 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Demo Credentials</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fillDemoCredentials(loginMode)}
            className="w-full py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
          >
            Use Demo {loginMode === 'admin' ? 'Admin' : 'Employee'} Account
          </button>

          {loginMode === 'admin' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Demo Admin:</strong> admin@demo.com / demo123
              </p>
            </div>
          )}
          {loginMode === 'employee' && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-xs text-emerald-800">
                <strong>Demo Employee:</strong> employee@demo.com / demo123
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const UserRoleIcon = ({ role }: { role: UserRole }) => {
  if (role === UserRole.ADMIN) return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
  return <Clock className="w-5 h-5 text-indigo-600" />;
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [sessionManagerOpen, setSessionManagerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Time Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  
  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'MEDIUM',
    dueDate: ''
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Employee Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<User | null>(null);
  const [isEmployeeViewModalOpen, setIsEmployeeViewModalOpen] = useState(false);
  const [selectedEmployeeForSettings, setSelectedEmployeeForSettings] = useState<User | null>(null);
  const [isEmployeeSettingsModalOpen, setIsEmployeeSettingsModalOpen] = useState(false);
  const [editingEmployeeData, setEditingEmployeeData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    role: ''
  });
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    department: 'Engineering',
    mobile: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: ''
  });

  // Project Management State
  const [projects, setProjects] = useState<any[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    clientName: '',
    budget: '',
    startDate: '',
    endDate: '',
    teamLeadId: '',
    priority: 'MEDIUM'
  });

  // Leave Management State
  const [isLeaveRequestModalOpen, setIsLeaveRequestModalOpen] = useState(false);
  const [leaveRefreshTrigger, setLeaveRefreshTrigger] = useState(0);
  
  // API Configuration
  const API_URL = 'http://localhost:5000/api';
  
  // Anti-Fraud State
  const lastActivityRef = useRef(Date.now());
  const sessionEventsRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  
  const [isIdle, setIsIdle] = useState(false);
  const [activityScore, setActivityScore] = useState(100);
  
  const IDLE_THRESHOLD = 15000; // 15 seconds for demo

  // Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      // Lowered threshold to 768px to avoid blocking desktops with smaller windows
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Activity Listeners (Anti-Fraud)
  useEffect(() => {
    if (!currentUser || !isTracking) return;

    const handleActivity = (e: Event) => {
      // Update refs immediately without triggering re-renders
      lastActivityRef.current = Date.now();
      sessionEventsRef.current += 1;
      
      // Note: We intentionally do NOT auto-clear isIdle here. 
      // User must explicitly click "I'm Back" if they triggered the idle state.
      // This prevents the "disappearing button" bug.
    };

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [currentUser, isTracking]);

  // Timer & Idle Logic
  useEffect(() => {
    if (isTracking) {
      // Clear any existing interval to be safe
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;
        
        // Idle Check
        if (timeSinceLastActivity > IDLE_THRESHOLD) {
          setIsIdle(true);
        } else {
          // Only increment time if not idle
          setElapsedSeconds(prev => prev + 1);
          if (isIdle) setIsIdle(false); // Auto-recover if logic permits, but mostly handled by button now
        }

        // Calculate Activity Score
        // Use functional state update to avoid dependency loop
        setActivityScore(prevScore => {
           const events = sessionEventsRef.current;
           sessionEventsRef.current = 0; // Reset for next second
           
           // Simple algorithm: >2 events/sec is "active"
           const targetScore = events > 2 ? 100 : Math.max(0, prevScore - 5);
           // Smooth transition
           return Math.floor((prevScore * 0.9) + (targetScore * 0.1));
        });

        // Generate "Proof of Work" Screenshot every 60 seconds of active work
        // We check elapsedSeconds % 60 === 0, but we need to ensure we don't duplicate
        // This is a simple mock, so exact timing isn't critical.
        // We use a ref check or modulo on the state. 
        // Since we are inside setState for elapsedSeconds usually, we can't easily check it here without deps.
        // Instead, we just use a modulo on the timestamp for the mock data generation.
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]); // Minimized dependencies to prevent re-creation of interval

  // Watch for screenshot generation based on elapsed time change
  useEffect(() => {
    if (isTracking && elapsedSeconds > 0 && elapsedSeconds % 60 === 0) {
      const newScreenshot: Screenshot = {
        id: `scr-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: `https://picsum.photos/300/200?random=${Date.now()}`,
        activityScore: activityScore
      };
      setScreenshots(prev => [newScreenshot, ...prev]);
    }
  }, [elapsedSeconds, isTracking]);

  const handleLogin = async (email: string, password: string) => {
    try {
      // Use login endpoint with email and password
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const { user, token, sessionId, deviceInfo } = response.data;
        setCurrentUser(user);
        setSessionInfo({ sessionId, deviceInfo });
        setActiveTab('dashboard');
        localStorage.setItem('token', token);
        localStorage.setItem('sessionInfo', JSON.stringify({ sessionId, deviceInfo }));
        return { success: true };
      } else {
        return { success: false, error: response.data.message || response.data.error || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please check your credentials.';
      
      // Handle mobile restriction error
      if (error.response?.status === 403 && error.response?.data?.reason === 'MOBILE_DEVICE_RESTRICTED') {
        return { success: false, error: 'Mobile login is not allowed for employees. Please use a desktop device.' };
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSessionInfo(null);
    setIsTracking(false);
    setElapsedSeconds(0);
    setScreenshots([]);
    setIsIdle(false);
    localStorage.removeItem('token');
    localStorage.removeItem('sessionInfo');
  };

  const handleResume = () => {
    setIsIdle(false);
    lastActivityRef.current = Date.now();
  };

  const handleCreateTask = async () => {
    console.log('handleCreateTask called');
    console.log('Task data:', newTaskData);
    
    if (!newTaskData.title || !newTaskData.assigneeId || !newTaskData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('Sending request to:', `${API_URL}/tasks`);
      
      const response = await axios.post(
        `${API_URL}/tasks`,
        {
          ...newTaskData,
          status: 'TODO'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
        // Add the new task to the local state
        setTasks(prev => [response.data.task, ...prev]);
        
        // Close modal and reset form
        setIsTaskModalOpen(false);
        setNewTaskData({
          title: '',
          description: '',
          assigneeId: '',
          priority: 'MEDIUM',
          dueDate: ''
        });
        
        alert('Task created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating task:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleCreateEmployee = async () => {
    if (!newEmployeeData.name || !newEmployeeData.email || !newEmployeeData.password || !newEmployeeData.mobile) {
      alert('Please fill in all required fields (Name, Email, Password, Mobile)');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auth/register`,
        newEmployeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Add the new user to the local state
        setUsers(prev => [response.data.user, ...prev]);
        
        // Close modal and reset form
        setIsEmployeeModalOpen(false);
        setNewEmployeeData({
          name: '',
          email: '',
          password: '',
          role: 'EMPLOYEE',
          department: 'Engineering',
          mobile: '',
          bankAccountNumber: '',
          bankName: '',
          ifscCode: ''
        });
        
        alert('Employee created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating employee:', error);
      alert(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectData.name || !newProjectData.budget || !newProjectData.startDate || !newProjectData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/projects`,
        {
          ...newProjectData,
          budget: parseFloat(newProjectData.budget)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setProjects(prev => [response.data.project, ...prev]);
        setIsProjectModalOpen(false);
        setNewProjectData({
          name: '',
          description: '',
          clientName: '',
          budget: '',
          startDate: '',
          endDate: '',
          teamLeadId: '',
          priority: 'MEDIUM'
        });
        alert('Project created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    }
  };

  // Fetch tasks when user logs in or tab changes to tasks
  useEffect(() => {
    if (currentUser && activeTab === 'tasks') {
      const fetchTasks = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/tasks`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setTasks(response.data.tasks);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
          // Fallback to mock data if API fails
          setTasks(MOCK_TASKS);
        }
      };
      fetchTasks();
    }
  }, [currentUser, activeTab]);

  // Fetch users when logged in
  useEffect(() => {
    if (currentUser) {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setUsers(response.data.users);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          // Fallback to mock users if API fails
          setUsers(MOCK_USERS);
        }
      };
      fetchUsers();
    }
  }, [currentUser]);

  // Fetch projects when logged in as admin
  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.ADMIN) {
      const fetchProjects = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/projects`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setProjects(response.data.projects);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        }
      };
      fetchProjects();
    }
  }, [currentUser]);

  if (isMobile) {
    return <MobileBlockScreen />;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} apiUrl={API_URL} />;
  }

  // --- Dashboard Component (Updated with Proof of Work) ---
  const Dashboard = () => {
    const data = [
      { name: 'Mon', hours: 6.5 },
      { name: 'Tue', hours: 7.2 },
      { name: 'Wed', hours: 5.8 },
      { name: 'Thu', hours: 8.0 },
      { name: 'Fri', hours: 4.5 },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: '12', sub: '+2 from yesterday', color: 'bg-blue-500' },
            { label: 'Pending', value: '5', sub: '3 high priority', color: 'bg-amber-500' },
            { label: 'Hours Worked', value: '32.5', sub: 'Target: 40h', color: 'bg-emerald-500' },
            { label: 'Productivity', value: '94%', sub: 'Based on activity', color: 'bg-indigo-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.color} w-2 h-2 rounded-full ring-4 ring-opacity-20 ring-${stat.color.replace('bg-', '')}`}></div>
              </div>
              <p className="text-xs text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Weekly Activity</h3>
                <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2 outline-none">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Proof of Work Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-500" />
                  Proof of Work 
                  <span className="text-xs font-normal text-slate-400 ml-2">(Simulated)</span>
                </h3>
                <button onClick={() => alert('View all screenshots')} className="text-xs text-indigo-600 font-medium hover:underline">View All</button>
              </div>
              
              {screenshots.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                  <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Start the timer to generate activity screenshots.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {screenshots.slice(0, 4).map((shot) => (
                    <div key={shot.id} className="group relative rounded-lg overflow-hidden border border-slate-200">
                      <img src={shot.imageUrl} alt="Screen capture" className="w-full h-24 object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 p-2 text-white">
                        <p className="text-[10px] font-mono">{shot.timestamp}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${shot.activityScore > 50 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="text-[10px] text-slate-300">Act: {shot.activityScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
            <h3 className="font-bold text-slate-800 mb-4">Team Status</h3>
            <div className="space-y-4">
              {MOCK_USERS.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={user.avatar} className="w-10 h-10 rounded-full" alt={user.name} />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.department}</p>
                  </div>
                  {user.isOnline && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full">Online</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TaskList = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {['All', 'To Do', 'In Progress', 'Completed'].map((filter) => (
              <button key={filter} onClick={() => console.log(`Filter by: ${filter}`)} className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 transition-colors">
                {filter}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>+ New Task</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-900">Task</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Assignee</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Priority</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Due Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(tasks.length > 0 ? tasks : MOCK_TASKS).map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">{task.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {MOCK_USERS.find(u => u.id === task.assigneeId)?.name.charAt(0) || 'U'}
                         </div>
                         <span className="text-xs">
                            {MOCK_USERS.find(u => u.id === task.assigneeId)?.name || 'Unassigned'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border
                        ${task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          task.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`flex items-center gap-1.5 text-xs font-semibold
                        ${task.priority === 'URGENT' ? 'text-red-600' : 
                          task.priority === 'HIGH' ? 'text-orange-500' : 'text-slate-500'}`}>
                          <AlertCircle className="w-3 h-3" />
                          {task.priority}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{task.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => alert(`Options for ${task.title}`)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Creation Modal */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Create New Task</h2>
                <p className="text-sm text-slate-500 mt-1">Fill in the details to create a new task</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTaskData.description}
                    onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                    placeholder="Enter task description"
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  />
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newTaskData.assigneeId}
                    onChange={(e) => setNewTaskData({...newTaskData, assigneeId: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select an employee</option>
                    {(users.length > 0 ? users : MOCK_USERS).filter(u => u.role === UserRole.EMPLOYEE || u.role === 'EMPLOYEE').map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>

                {/* Priority and Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTaskData.priority}
                      onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newTaskData.dueDate}
                      onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsTaskModalOpen(false);
                    setNewTaskData({
                      title: '',
                      description: '',
                      assigneeId: '',
                      priority: 'MEDIUM',
                      dueDate: ''
                    });
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Projects = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Project
          </button>
        </div>

        {/* Projects Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">Total Projects</p>
            <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
            <p className="text-xs text-green-600 mt-2">All projects</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-slate-900">LKR {(projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0)).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            <p className="text-xs text-slate-600 mt-2">All projects combined</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">Pending Payments</p>
            <p className="text-3xl font-bold text-orange-600">LKR {(projects.reduce((sum, p) => sum + (p.pendingAmount || 0), 0)).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            <p className="text-xs text-orange-600 mt-2">Total due</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{projects.filter(p => p.status === 'IN_PROGRESS').length}</p>
            <p className="text-xs text-blue-600 mt-2">Active projects</p>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-900">Project</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Client</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Budget</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Progress</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Due Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Pending</th>
                  <th className="px-6 py-4 font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{project.name}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">{project.description}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{project.clientName || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">LKR {Number(project.budget).toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border
                        ${project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          project.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' :
                          project.status === 'PLANNING' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${project.progress || 0}%`}}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-700">{project.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{new Date(project.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono text-sm font-semibold">
                      <span className="text-orange-600">LKR {Number(project.pendingAmount).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm transition-colors border border-indigo-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Creation Modal */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
                <p className="text-sm text-slate-500 mt-1">Add a new project to track</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name <span className="text-red-500">*</span></label>
                  <input type="text" value={newProjectData.name} onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})} placeholder="Enter project name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea value={newProjectData.description} onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})} placeholder="Project description" rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
                    <input type="text" value={newProjectData.clientName} onChange={(e) => setNewProjectData({...newProjectData, clientName: e.target.value})} placeholder="Client name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget <span className="text-red-500">*</span></label>
                    <input type="number" value={newProjectData.budget} onChange={(e) => setNewProjectData({...newProjectData, budget: e.target.value})} placeholder="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                    <input type="date" value={newProjectData.startDate} onChange={(e) => setNewProjectData({...newProjectData, startDate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date <span className="text-red-500">*</span></label>
                    <input type="date" value={newProjectData.endDate} onChange={(e) => setNewProjectData({...newProjectData, endDate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Team Lead</label>
                    <select value={newProjectData.teamLeadId} onChange={(e) => setNewProjectData({...newProjectData, teamLeadId: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="">Select team lead</option>
                      {users.map(user => (<option key={user.id} value={user.id}>{user.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                    <select value={newProjectData.priority} onChange={(e) => setNewProjectData({...newProjectData, priority: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                <button onClick={() => { setIsProjectModalOpen(false); setNewProjectData({ name: '', description: '', clientName: '', budget: '', startDate: '', endDate: '', teamLeadId: '', priority: 'MEDIUM' }); }} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={handleCreateProject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create Project</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EmployeeList = () => {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Team Members</h2>
            <button 
              onClick={() => setIsEmployeeModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Add Employee
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(users.length > 0 ? users : MOCK_USERS).map(user => (
              <div key={user.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                       <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-indigo-50" />
                       <div>
                          <h3 className="font-bold text-slate-900">{user.name}</h3>
                          <p className="text-sm text-slate-500">{user.role}</p>
                       </div>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-slate-300'}`}></span>
                 </div>
                 <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-50">
                    <div>
                       <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Department</p>
                       <p className="text-sm font-medium text-slate-700">{user.department}</p>
                    </div>
                    <div>
                       <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Today</p>
                       <p className="text-sm font-medium text-slate-700">6h 30m</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedEmployeeForView(user);
                        setIsEmployeeViewModalOpen(true);
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                    >
                       View Logs
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedEmployeeForSettings(user);
                        setEditingEmployeeData({
                          name: user.name,
                          email: user.email,
                          mobile: user.mobile || '',
                          department: user.department,
                          role: user.role
                        });
                        setIsEmployeeSettingsModalOpen(true);
                      }}
                      className="px-3 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                    >
                       <Settings className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            ))}
         </div>

         {/* Employee Creation Modal */}
         {isEmployeeModalOpen && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6 border-b border-slate-200">
                 <h2 className="text-2xl font-bold text-slate-900">Add New Employee</h2>
                 <p className="text-sm text-slate-500 mt-1">Create a new team member account</p>
               </div>

               <div className="p-6 space-y-4">
                 {/* Name */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Full Name <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     value={newEmployeeData.name}
                     onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})}
                     placeholder="Enter full name"
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Email */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Email Address <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="email"
                     value={newEmployeeData.email}
                     onChange={(e) => setNewEmployeeData({...newEmployeeData, email: e.target.value})}
                     placeholder="employee@company.com"
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Password */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Password <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="password"
                     value={newEmployeeData.password}
                     onChange={(e) => setNewEmployeeData({...newEmployeeData, password: e.target.value})}
                     placeholder="Enter password"
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Mobile Number */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Mobile Number <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="tel"
                     value={newEmployeeData.mobile}
                     onChange={(e) => setNewEmployeeData({...newEmployeeData, mobile: e.target.value})}
                     placeholder="+1 (555) 000-0000"
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Role and Department */}
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">
                       Role
                     </label>
                     <select
                       value={newEmployeeData.role}
                       onChange={(e) => setNewEmployeeData({...newEmployeeData, role: e.target.value})}
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                     >
                       <option value="EMPLOYEE">Employee</option>
                       <option value="TEAM_LEADER">Team Leader</option>
                       <option value="ADMIN">Admin</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">
                       Department
                     </label>
                     <input
                       type="text"
                       value={newEmployeeData.department}
                       onChange={(e) => setNewEmployeeData({...newEmployeeData, department: e.target.value})}
                       placeholder="Engineering"
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                     />
                   </div>
                 </div>

                 {/* Bank Details Section */}
                 <div className="pt-4 border-t border-slate-200">
                   <h3 className="text-sm font-semibold text-slate-900 mb-4">Bank Account Details (Optional)</h3>
                   
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">
                         Bank Name
                       </label>
                       <input
                         type="text"
                         value={newEmployeeData.bankName}
                         onChange={(e) => setNewEmployeeData({...newEmployeeData, bankName: e.target.value})}
                         placeholder="e.g., Chase Bank"
                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                       />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">
                           Account Number
                         </label>
                         <input
                           type="text"
                           value={newEmployeeData.bankAccountNumber}
                           onChange={(e) => setNewEmployeeData({...newEmployeeData, bankAccountNumber: e.target.value})}
                           placeholder="XXXXXXXXXXXX"
                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                         />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">
                           IFSC/Routing Code
                         </label>
                         <input
                           type="text"
                           value={newEmployeeData.ifscCode}
                           onChange={(e) => setNewEmployeeData({...newEmployeeData, ifscCode: e.target.value})}
                           placeholder="IFSC0001234"
                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                         />
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                 <button
                   onClick={() => {
                     setIsEmployeeModalOpen(false);
                     setNewEmployeeData({
                       name: '',
                       email: '',
                       password: '',
                       role: 'EMPLOYEE',
                       department: 'Engineering',
                       mobile: '',
                       bankAccountNumber: '',
                       bankName: '',
                       ifscCode: ''
                     });
                   }}
                   className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleCreateEmployee}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                 >
                   Add Employee
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Employee View/Logs Modal */}
         {isEmployeeViewModalOpen && selectedEmployeeForView && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-900">Employee Details</h2>
                 <button
                   onClick={() => {
                     setIsEmployeeViewModalOpen(false);
                     setSelectedEmployeeForView(null);
                   }}
                   className="text-slate-400 hover:text-slate-600 text-2xl"
                 >
                   ×
                 </button>
               </div>

               <div className="p-6 space-y-6">
                 {/* Profile Section */}
                 <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                   <img src={selectedEmployeeForView.avatar} alt={selectedEmployeeForView.name} className="w-20 h-20 rounded-full border-2 border-indigo-100" />
                   <div>
                     <h3 className="text-xl font-bold text-slate-900">{selectedEmployeeForView.name}</h3>
                     <p className="text-sm text-slate-500">{selectedEmployeeForView.email}</p>
                     <div className="flex gap-2 mt-2">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedEmployeeForView.isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                         {selectedEmployeeForView.isOnline ? '🟢 Online' : '⚫ Offline'}
                       </span>
                     </div>
                   </div>
                 </div>

                 {/* Information Grid */}
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Role</p>
                     <p className="text-sm font-medium text-slate-700">{selectedEmployeeForView.role}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Department</p>
                     <p className="text-sm font-medium text-slate-700">{selectedEmployeeForView.department}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Mobile</p>
                     <p className="text-sm font-medium text-slate-700">{selectedEmployeeForView.mobile || 'N/A'}</p>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Today's Hours</p>
                     <p className="text-sm font-medium text-slate-700">6h 30m</p>
                   </div>
                 </div>

                 {/* Activity Logs */}
                 <div className="pt-4 border-t border-slate-200">
                   <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
                   <div className="space-y-3">
                     <div className="flex gap-3 pb-3 border-b border-slate-100">
                       <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                       <div>
                         <p className="text-sm font-medium text-slate-700">Logged in</p>
                         <p className="text-xs text-slate-400">Today at 9:00 AM</p>
                       </div>
                     </div>
                     <div className="flex gap-3 pb-3 border-b border-slate-100">
                       <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                       <div>
                         <p className="text-sm font-medium text-slate-700">Completed task</p>
                         <p className="text-xs text-slate-400">Today at 2:30 PM</p>
                       </div>
                     </div>
                     <div className="flex gap-3">
                       <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                       <div>
                         <p className="text-sm font-medium text-slate-700">Status updated</p>
                         <p className="text-xs text-slate-400">Today at 3:15 PM</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                 <button
                   onClick={() => {
                     setIsEmployeeViewModalOpen(false);
                     setSelectedEmployeeForView(null);
                   }}
                   className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                 >
                   Close
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Employee Settings Modal */}
         {isEmployeeSettingsModalOpen && selectedEmployeeForSettings && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-slate-900">Employee Settings</h2>
                 <button
                   onClick={() => {
                     setIsEmployeeSettingsModalOpen(false);
                     setSelectedEmployeeForSettings(null);
                   }}
                   className="text-slate-400 hover:text-slate-600 text-2xl"
                 >
                   ×
                 </button>
               </div>

               <div className="p-6 space-y-4">
                 {/* Name */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Full Name
                   </label>
                   <input
                     type="text"
                     value={editingEmployeeData.name}
                     onChange={(e) => setEditingEmployeeData({...editingEmployeeData, name: e.target.value})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Email */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Email Address
                   </label>
                   <input
                     type="email"
                     value={editingEmployeeData.email}
                     onChange={(e) => setEditingEmployeeData({...editingEmployeeData, email: e.target.value})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Mobile */}
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Mobile Number
                   </label>
                   <input
                     type="tel"
                     value={editingEmployeeData.mobile}
                     onChange={(e) => setEditingEmployeeData({...editingEmployeeData, mobile: e.target.value})}
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                   />
                 </div>

                 {/* Department & Role */}
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">
                       Department
                     </label>
                     <input
                       type="text"
                       value={editingEmployeeData.department}
                       onChange={(e) => setEditingEmployeeData({...editingEmployeeData, department: e.target.value})}
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">
                       Role
                     </label>
                     <select
                       value={editingEmployeeData.role}
                       onChange={(e) => setEditingEmployeeData({...editingEmployeeData, role: e.target.value})}
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                     >
                       <option value="EMPLOYEE">Employee</option>
                       <option value="TEAM_LEADER">Team Leader</option>
                       <option value="ADMIN">Admin</option>
                     </select>
                   </div>
                 </div>

                 {/* Account Status */}
                 <div className="pt-4 border-t border-slate-200">
                   <h3 className="font-semibold text-slate-900 mb-4">Account Status</h3>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                       <div>
                         <p className="text-sm font-medium text-slate-700">Status</p>
                         <p className="text-xs text-slate-500">User is currently {selectedEmployeeForSettings.isOnline ? 'online' : 'offline'}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedEmployeeForSettings.isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                         {selectedEmployeeForSettings.isOnline ? 'Online' : 'Offline'}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
                 <button
                   onClick={() => {
                     setIsEmployeeSettingsModalOpen(false);
                     setSelectedEmployeeForSettings(null);
                   }}
                   className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     alert('Employee settings updated successfully!');
                     setIsEmployeeSettingsModalOpen(false);
                     setSelectedEmployeeForSettings(null);
                   }}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                 >
                   Save Changes
                 </button>
               </div>
             </div>
           </div>
         )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        currentUser={currentUser} 
        activeTab={activeTab} 
        onNavigate={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu className="w-6 h-6" />
             </button>
             <h2 className="text-xl font-bold text-slate-800 capitalize hidden md:block">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search tasks, people..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
                />
             </div>
             {currentUser?.role === UserRole.ADMIN && (
                <button 
                   onClick={() => setNotificationCenterOpen(true)}
                   className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                >
                   <Bell className="w-5 h-5" />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
             )}
             <button 
                onClick={() => setSessionManagerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
             >
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Sessions</span>
             </button>
             {currentUser?.role !== UserRole.ADMIN && (
                <button
                   onClick={() => setIsLeaveRequestModalOpen(true)}
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                   <Calendar className="w-4 h-4" />
                   <span className="hidden sm:inline">Request Leave</span>
                </button>
             )}
             <button 
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium"
             >
                Logout
             </button>
          </div>
        </header>

        {/* Persistent Time Tracker Bar if User is Employee/Leader */}
        {currentUser.role !== UserRole.ADMIN && (
          <div className="bg-white border-b border-slate-200 px-6 py-4">
             <TimeTracker 
                isTracking={isTracking} 
                isIdle={isIdle}
                elapsedSeconds={elapsedSeconds}
                activityScore={activityScore}
                onStart={() => setIsTracking(true)}
                onStop={() => setIsTracking(false)}
                onResume={handleResume}
             />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
           <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'tasks' && <TaskList />}
              {activeTab === 'projects' && <Projects />}
              {activeTab === 'employees' && <EmployeeList />}
              {activeTab === 'leaves' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Leave Management</h2>
                    {currentUser?.role !== UserRole.ADMIN && (
                      <button
                        onClick={() => setIsLeaveRequestModalOpen(true)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        Request Leave
                      </button>
                    )}
                  </div>

                  {/* Calendar and Requests */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <LeaveCalendar
                        token={localStorage.getItem('token') || ''}
                        isAdmin={currentUser?.role === UserRole.ADMIN}
                        userId={currentUser?.id as unknown as number}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600">Pending Requests</p>
                            <p className="text-2xl font-bold text-blue-900">-</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600">Approved Leaves</p>
                            <p className="text-2xl font-bold text-green-900">-</p>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-lg">
                            <p className="text-sm text-amber-600">Used Days (This Year)</p>
                            <p className="text-2xl font-bold text-amber-900">-</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requests List */}
                  <LeaveRequestsList
                    token={localStorage.getItem('token') || ''}
                    isAdmin={currentUser?.role === UserRole.ADMIN}
                    userId={currentUser?.id as unknown as number}
                    onRefresh={() => setLeaveRefreshTrigger(prev => prev + 1)}
                  />
                </div>
              )}
              {activeTab === 'timesheet' && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <Calendar className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Timesheet logs would appear here.</p>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
                    <div className="flex gap-3">
                      <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last Year</option>
                        <option>Custom Range</option>
                      </select>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Export Report
                      </button>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-500">Total Hours</span>
                        <Clock className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">324.5h</p>
                      <p className="text-sm text-green-600 mt-2">↑ 12% from last period</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-500">Active Employees</span>
                        <Activity className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">42</p>
                      <p className="text-sm text-green-600 mt-2">↑ 8% from last period</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-500">Tasks Completed</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">187</p>
                      <p className="text-sm text-green-600 mt-2">↑ 23% from last period</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-500">Avg Productivity</span>
                        <BarChart2 className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-3xl font-bold text-slate-900">87%</p>
                      <p className="text-sm text-red-600 mt-2">↓ 3% from last period</p>
                    </div>
                  </div>

                  {/* Time Distribution Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Time Distribution by Day</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { day: 'Mon', hours: 48, tasks: 12 },
                        { day: 'Tue', hours: 52, tasks: 15 },
                        { day: 'Wed', hours: 45, tasks: 11 },
                        { day: 'Thu', hours: 58, tasks: 18 },
                        { day: 'Fri', hours: 42, tasks: 14 },
                        { day: 'Sat', hours: 20, tasks: 5 },
                        { day: 'Sun', hours: 15, tasks: 3 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                          labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                        />
                        <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Department Performance */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900">Department Performance</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900">Department</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Employees</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Total Hours</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Tasks Done</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Productivity</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">Engineering</td>
                            <td className="px-6 py-4 text-slate-600">15</td>
                            <td className="px-6 py-4 text-slate-600">120.5h</td>
                            <td className="px-6 py-4 text-slate-600">67</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-slate-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-slate-900">92%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                Excellent
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">Design</td>
                            <td className="px-6 py-4 text-slate-600">8</td>
                            <td className="px-6 py-4 text-slate-600">64.0h</td>
                            <td className="px-6 py-4 text-slate-600">45</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-slate-200 rounded-full h-2">
                                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '88%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-slate-900">88%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                Good
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">Marketing</td>
                            <td className="px-6 py-4 text-slate-600">12</td>
                            <td className="px-6 py-4 text-slate-600">96.0h</td>
                            <td className="px-6 py-4 text-slate-600">52</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-slate-200 rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{width: '75%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-slate-900">75%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                Average
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">Sales</td>
                            <td className="px-6 py-4 text-slate-600">7</td>
                            <td className="px-6 py-4 text-slate-600">44.0h</td>
                            <td className="px-6 py-4 text-slate-600">23</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-slate-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                                </div>
                                <span className="text-sm font-medium text-slate-900">85%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                Good
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">Top Performers</h3>
                        <p className="text-sm text-slate-500 mt-1">Based on hours worked and productivity</p>
                      </div>
                      <div className="p-6 space-y-4">
                        {[
                          { name: 'Sarah Johnson', hours: 42, productivity: 95, avatar: 'SJ' },
                          { name: 'Mike Brown', hours: 40, productivity: 92, avatar: 'MB' },
                          { name: 'Emily Davis', hours: 38, productivity: 90, avatar: 'ED' },
                          { name: 'John Smith', hours: 37, productivity: 88, avatar: 'JS' },
                          { name: 'Alex Wilson', hours: 36, productivity: 87, avatar: 'AW' }
                        ].map((person, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-lg font-bold text-slate-400 w-6">{index + 1}</span>
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                                {person.avatar}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{person.name}</p>
                                <p className="text-xs text-slate-500">{person.hours}h worked</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-600">{person.productivity}%</p>
                              <p className="text-xs text-slate-500">productivity</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">Activity Timeline</h3>
                        <p className="text-sm text-slate-500 mt-1">Recent significant events</p>
                      </div>
                      <div className="p-6 space-y-4">
                        {[
                          { time: '10 mins ago', event: 'Task completed by Sarah Johnson', type: 'success' },
                          { time: '25 mins ago', event: 'New employee added to system', type: 'info' },
                          { time: '1 hour ago', event: 'Mike Brown marked as idle', type: 'warning' },
                          { time: '2 hours ago', event: 'Weekly report generated', type: 'info' },
                          { time: '3 hours ago', event: '5 new tasks assigned', type: 'success' }
                        ].map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              item.type === 'success' ? 'bg-green-500' : 
                              item.type === 'warning' ? 'bg-amber-500' : 
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{item.event}</p>
                              <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                  
                  {/* General Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900">General Settings</h3>
                      <p className="text-sm text-slate-500 mt-1">Configure basic system preferences</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Company Name</p>
                          <p className="text-sm text-slate-500">Display name for your organization</p>
                        </div>
                        <input
                          type="text"
                          defaultValue="Remote Team Inc."
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Time Zone</p>
                          <p className="text-sm text-slate-500">Set your organization's time zone</p>
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                          <option>UTC (GMT+0)</option>
                          <option>EST (GMT-5)</option>
                          <option>PST (GMT-8)</option>
                          <option>IST (GMT+5:30)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Date Format</p>
                          <p className="text-sm text-slate-500">Choose date display format</p>
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900">Time Tracking Settings</h3>
                      <p className="text-sm text-slate-500 mt-1">Configure employee monitoring preferences</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Screenshot Interval</p>
                          <p className="text-sm text-slate-500">Frequency of automatic screenshots</p>
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                          <option>Every 5 minutes</option>
                          <option>Every 10 minutes</option>
                          <option>Every 15 minutes</option>
                          <option>Every 30 minutes</option>
                          <option>Every 60 minutes</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Idle Time Threshold</p>
                          <p className="text-sm text-slate-500">Minutes before user is marked as idle</p>
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                          <option>5 minutes</option>
                          <option>10 minutes</option>
                          <option>15 minutes</option>
                          <option>20 minutes</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Activity Tracking</p>
                          <p className="text-sm text-slate-500">Monitor mouse and keyboard activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Screenshot Storage</p>
                          <p className="text-sm text-slate-500">Enable screenshot capture and storage</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900">Notification Settings</h3>
                      <p className="text-sm text-slate-500 mt-1">Manage email and system notifications</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Email Notifications</p>
                          <p className="text-sm text-slate-500">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Task Assignments</p>
                          <p className="text-sm text-slate-500">Notify when new tasks are assigned</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Idle Time Alerts</p>
                          <p className="text-sm text-slate-500">Alert when employees are idle too long</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900">Security Settings</h3>
                      <p className="text-sm text-slate-500 mt-1">Manage security and authentication</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Change Password</p>
                          <p className="text-sm text-slate-500">Update your account password</p>
                        </div>
                        <button
                          onClick={async () => {
                            const currentPassword = prompt('Enter current password:');
                            if (!currentPassword) return;
                            
                            const newPassword = prompt('Enter new password (min 6 characters):');
                            if (!newPassword) return;
                            
                            const confirmPassword = prompt('Confirm new password:');
                            if (!confirmPassword) return;
                            
                            if (newPassword !== confirmPassword) {
                              alert('Passwords do not match!');
                              return;
                            }
                            
                            if (newPassword.length < 6) {
                              alert('Password must be at least 6 characters!');
                              return;
                            }
                            
                            try {
                              const response = await axios.post(`${API_URL}/auth/change-password`, {
                                userId: currentUser?.id,
                                currentPassword,
                                newPassword
                              });
                              
                              if (response.data.success) {
                                alert('Password changed successfully!');
                              } else {
                                alert(response.data.message || 'Failed to change password');
                              }
                            } catch (error: any) {
                              alert(error.response?.data?.message || 'Failed to change password');
                            }
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                          <p className="text-sm text-slate-500">Require 2FA for all users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Session Timeout</p>
                          <p className="text-sm text-slate-500">Auto-logout after inactivity</p>
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>2 hours</option>
                          <option>4 hours</option>
                          <option>Never</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="font-medium text-slate-900">Password Expiry</p>
                          <p className="text-sm text-slate-500">Force password change after</p>
                        </div>
                        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>Never</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                      Reset to Default
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Save Settings
                    </button>
                  </div>
                </div>
              )}
           </div>
        </main>
      </div>

      {/* Chat Component - Always visible when logged in */}
      {currentUser && <Chat currentUser={currentUser} />}

      {/* Notification Center - Admin Only */}
      {currentUser?.role === UserRole.ADMIN && (
        <NotificationCenter
          isOpen={notificationCenterOpen}
          onClose={() => setNotificationCenterOpen(false)}
          token={localStorage.getItem('token') || ''}
        />
      )}

      {/* Session Manager - All Users */}
      {sessionManagerOpen && (
        <SessionManager
          token={localStorage.getItem('token') || ''}
          onClose={() => setSessionManagerOpen(false)}
        />
      )}

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveRequestModalOpen}
        onClose={() => setIsLeaveRequestModalOpen(false)}
        token={localStorage.getItem('token') || ''}
        onSuccess={() => {
          setIsLeaveRequestModalOpen(false);
          setLeaveRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
};

export default App;