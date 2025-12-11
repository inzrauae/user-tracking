import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { LeaveType, LeaveStatus } from '../types';

interface LeaveEvent {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: Date | string;
  endDate: Date | string;
  leaveType: LeaveType;
  status: LeaveStatus;
}

interface LeaveCalendarProps {
  token: string;
  isAdmin: boolean;
  userId?: number;
  onDateClick?: (date: Date) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  token,
  isAdmin,
  userId,
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaves, setLeaves] = useState<LeaveEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [currentDate]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leaves/calendar/dates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeaves(data.leaves || []);
      }
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }
    setLoading(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInLeave = (date: Date): LeaveEvent[] => {
    return leaves.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getLeaveColor = (leaveType: LeaveType) => {
    switch (leaveType) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'SICK':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'CASUAL':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'PERSONAL':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'ANNUAL':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'PENDING':
        return <Clock className="w-3 h-3" />;
      case 'REJECTED':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const days = [];
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Leave Calendar</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold min-w-48 text-center">{monthName}</span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b">
        {(['CASUAL', 'SICK', 'EMERGENCY', 'PERSONAL', 'ANNUAL'] as LeaveType[]).map(type => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${getLeaveColor(type).split(' ')[0]}`}></div>
            <span className="text-sm text-slate-600">{type}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-slate-700 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            const leaveEventsOnDate = date ? isDateInLeave(date) : [];
            const isToday = date && 
              date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

            return (
              <div
                key={index}
                className={`min-h-24 p-2 border rounded-lg transition ${
                  !date
                    ? 'bg-gray-50'
                    : isToday
                    ? 'border-indigo-500 bg-indigo-50'
                    : isCurrentMonth
                    ? 'border-slate-200 bg-white hover:bg-gray-50'
                    : 'border-gray-100 bg-gray-50'
                } cursor-pointer`}
                onClick={() => date && onDateClick?.(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${
                      isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {leaveEventsOnDate.map((leave, i) => (
                        <div
                          key={leave.id}
                          className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getLeaveColor(leave.leaveType)}`}
                          title={`${leave.employeeName} - ${leave.leaveType}`}
                        >
                          {getStatusIcon(leave.status)}
                          <span className="truncate">
                            {isAdmin ? leave.employeeName : leave.leaveType}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Displayed leaves show approved and pending requests.
          {isAdmin && ' Admins can see all employees\' leaves.'}
          {!isAdmin && ' Only your leaves are displayed.'}
        </p>
      </div>
    </div>
  );
};
