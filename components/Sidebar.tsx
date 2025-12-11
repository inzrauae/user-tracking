import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Clock, 
  BarChart2, 
  Settings, 
  LogOut,
  Briefcase,
  Calendar
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeTab, onNavigate, onLogout, isOpen }) => {
  const isAdmin = currentUser.role === UserRole.ADMIN;
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'timesheet', label: 'Timesheet', icon: Clock },
    { id: 'leaves', label: 'Leaves', icon: Calendar },
    ...(isAdmin ? [{ id: 'projects', label: 'Projects', icon: Briefcase }] : []),
    ...(isAdmin ? [{ id: 'employees', label: 'Employees', icon: Users }] : []),
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col h-full`}>
      <div className="p-6 border-b border-slate-800">
        <div className="w-full">
          <img src="/logo-1 (1).png" alt="RemoteSync Logo" className="w-full h-auto" />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            type="button"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full border-2 border-indigo-500"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{currentUser.role.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          type="button"
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">RemoteSync Team Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
