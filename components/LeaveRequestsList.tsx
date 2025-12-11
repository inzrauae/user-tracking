import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '../types';

interface LeaveRequestsListProps {
  token: string;
  isAdmin: boolean;
  userId?: number;
  onRefresh?: () => void;
}

export const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({
  token,
  isAdmin,
  userId,
  onRefresh
}) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<LeaveStatus | 'ALL'>('ALL');
  const [approveModalOpen, setApproveModalOpen] = useState<number | null>(null);
  const [approvalData, setApprovalData] = useState({ status: 'APPROVED', notes: '' });

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter !== 'ALL') query.append('status', filter);
      if (userId && !isAdmin) query.append('userId', userId.toString());

      const response = await fetch(`/api/leaves?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
    }
    setLoading(false);
  };

  const handleApproveReject = async (requestId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/leaves/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          adminNotes: approvalData.notes
        })
      });

      if (response.ok) {
        setApproveModalOpen(null);
        setApprovalData({ status: 'APPROVED', notes: '' });
        fetchRequests();
        onRefresh?.();
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
    }
  };

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Leave Requests</h2>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as (LeaveStatus | 'ALL')[]).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Loading leave requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No leave requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(request => (
            <div
              key={request.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(request.status)}
                    <div>
                      {isAdmin && (
                        <p className="text-sm font-medium text-indigo-600">
                          {request.employee?.name || 'Unknown Employee'}
                        </p>
                      )}
                      <h3 className="font-semibold text-slate-900">{request.leaveType}</h3>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-600">From</p>
                      <p className="font-medium text-slate-900">{formatDate(request.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">To</p>
                      <p className="font-medium text-slate-900">{formatDate(request.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium text-slate-900">{request.numberOfDays} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Requested</p>
                      <p className="font-medium text-slate-900">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-gray-600 text-sm mb-1">Reason:</p>
                    <p className="text-slate-900 text-sm">{request.reason}</p>
                  </div>

                  {request.isWorkingFromHome && (
                    <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Working from home
                    </div>
                  )}

                  {request.adminNotes && (
                    <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-xs text-gray-600 mb-1">Admin Notes:</p>
                      <p className="text-sm text-slate-900">{request.adminNotes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {isAdmin && request.status === 'PENDING' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setApproveModalOpen(request.id)}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveReject(request.id, 'reject')}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Approve Leave Request</h3>
            <textarea
              placeholder="Admin notes (optional)"
              value={approvalData.notes}
              onChange={(e) => setApprovalData({ ...approvalData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setApproveModalOpen(null)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => approveModalOpen && handleApproveReject(approveModalOpen, 'approve')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
