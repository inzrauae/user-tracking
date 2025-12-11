import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, Lock, Zap } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  relatedData: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
    setLoading(false);
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MOBILE_LOGIN_RESTRICTED':
        return <Lock className="w-5 h-5 text-orange-500" />;
      case 'MULTIPLE_LOGIN_ATTEMPT':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'LOGIN_ANOMALY':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'SESSION_INVALIDATED':
        return <Lock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 border-l-4 border-red-500';
      case 'HIGH':
        return 'bg-orange-100 border-l-4 border-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-100 border-l-4 border-yellow-500';
      default:
        return 'bg-gray-100 border-l-4 border-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-end pt-16">
      <div className="bg-white w-full max-w-md h-[calc(100vh-4rem)] shadow-2xl rounded-l-lg flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    notif.isRead ? '' : 'bg-blue-50'
                  } ${getPriorityColor(notif.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{notif.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notif.message}
                      </p>
                      {notif.relatedData && (
                        <div className="mt-2 text-xs text-gray-500 bg-white/50 p-2 rounded">
                          <p>
                            <strong>User:</strong>{' '}
                            {notif.relatedData.userEmail || 'N/A'}
                          </p>
                          {notif.relatedData.deviceInfo && (
                            <p>
                              <strong>Device:</strong>{' '}
                              {notif.relatedData.deviceInfo.browser ||
                                'Unknown'}{' '}
                              on{' '}
                              {notif.relatedData.deviceInfo.os || 'Unknown'}
                            </p>
                          )}
                          {notif.relatedData.ipAddress && (
                            <p>
                              <strong>IP:</strong> {notif.relatedData.ipAddress}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <time className="text-xs text-gray-500">
                          {new Date(notif.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </time>
                        <div className="flex gap-2">
                          {!notif.isRead && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="border-t px-6 py-3 bg-gray-50">
            <button
              onClick={markAllAsRead}
              className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition font-medium"
            >
              Mark All as Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
