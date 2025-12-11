import React, { useState, useEffect } from 'react';
import { LogOut, Monitor, Smartphone, Globe } from 'lucide-react';

interface Session {
  id: number;
  deviceId: string;
  browser: string;
  os: string;
  deviceType: string;
  ipAddress: string;
  isMobile: boolean;
  isTablet: boolean;
  loginTime: string;
  lastActivityTime: string;
  status: string;
}

interface SessionManagerProps {
  token: string;
  onClose: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  token,
  onClose,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutSessionId, setLogoutSessionId] = useState<number | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
    setLoading(false);
  };

  const logoutFromDevice = async (sessionId: number) => {
    setLogoutSessionId(sessionId);
    try {
      const response = await fetch(`/api/auth/logout-device/${sessionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to logout from device:', error);
    }
    setLogoutSessionId(null);
  };

  const getDeviceIcon = (session: Session) => {
    if (session.isMobile) {
      return <Smartphone className="w-5 h-5 text-blue-500" />;
    }
    if (session.isTablet) {
      return <Monitor className="w-5 h-5 text-purple-500" />;
    }
    return <Globe className="w-5 h-5 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Sessions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Manage your active sessions across devices. You can logout from
            devices remotely.
          </p>
        </div>

        {/* Sessions List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              No active sessions
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getDeviceIcon(session)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {session.browser || 'Unknown Browser'} on{' '}
                          {session.os || 'Unknown OS'}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Device Type:</strong>{' '}
                            {session.deviceType || 'Desktop'}
                          </p>
                          <p>
                            <strong>IP Address:</strong> {session.ipAddress}
                          </p>
                          <p>
                            <strong>Login Time:</strong>{' '}
                            {formatDate(session.loginTime)}
                          </p>
                          <p>
                            <strong>Last Activity:</strong>{' '}
                            {formatDate(session.lastActivityTime)}
                          </p>
                          {session.status === 'INVALIDATED' && (
                            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-xs">
                              This session has been invalidated
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {session.status === 'ACTIVE' && (
                      <button
                        onClick={() => logoutFromDevice(session.id)}
                        disabled={logoutSessionId === session.id}
                        className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {logoutSessionId === session.id
                            ? 'Logging out...'
                            : 'Logout'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
