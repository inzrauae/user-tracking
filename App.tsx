import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, UserRole, Task, TimeEntry, DashboardStats, Screenshot } from './types';
import Sidebar from './components/Sidebar';
import TimeTracker from './components/TimeTracker';
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
const LoginScreen = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500">Sign in to manage your remote team</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => onLogin(UserRole.ADMIN)}
            className="w-full p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group"
          >
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <UserRoleIcon role={UserRole.ADMIN} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">Login as Admin</p>
              <p className="text-xs text-slate-500">Full access to settings & reports</p>
            </div>
          </button>

          <button 
            onClick={() => onLogin(UserRole.EMPLOYEE)}
            className="w-full p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group"
          >
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <UserRoleIcon role={UserRole.EMPLOYEE} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">Login as Employee</p>
              <p className="text-xs text-slate-500">Task management & time tracking</p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Demo Mode • No password required</p>
        </div>
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Time Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  
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

    const handleActivity = () => {
      // Update refs immediately without triggering re-renders
      lastActivityRef.current = Date.now();
      sessionEventsRef.current += 1;
      
      // Note: We intentionally do NOT auto-clear isIdle here. 
      // User must explicitly click "I'm Back" if they triggered the idle state.
      // This prevents the "disappearing button" bug.
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

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

  const handleLogin = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsTracking(false);
    setElapsedSeconds(0);
    setScreenshots([]);
    setIsIdle(false);
  };

  const handleResume = () => {
    setIsIdle(false);
    lastActivityRef.current = Date.now();
  };

  if (isMobile) {
    return <MobileBlockScreen />;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
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
                <button className="text-xs text-indigo-600 font-medium hover:underline">View All</button>
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
              <button key={filter} className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 transition-colors">
                {filter}
              </button>
            ))}
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
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
                {MOCK_TASKS.map((task) => (
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
                      <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const EmployeeList = () => {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Team Members</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Add Employee
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_USERS.map(user => (
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
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                       View Logs
                    </button>
                    <button className="px-3 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200">
                       <Settings className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            ))}
         </div>
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
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
              {activeTab === 'employees' && <EmployeeList />}
              {activeTab === 'timesheet' && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <Calendar className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Timesheet logs would appear here.</p>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Detailed reports module.</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <Settings className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">System configuration settings.</p>
                </div>
              )}
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;