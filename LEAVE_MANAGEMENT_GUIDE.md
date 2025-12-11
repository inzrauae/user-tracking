# Leave Management System - Complete Implementation Guide

## Overview

A comprehensive leave management system has been implemented allowing employees to request leaves, admins to approve/reject, and a calendar view for tracking leave dates.

## Features Implemented

### 1. For Employees
- ✅ Request leaves with multiple types (Casual, Sick, Emergency, Personal, Annual)
- ✅ Add detailed reasons for leave requests
- ✅ Select date ranges for leave duration
- ✅ Automatic day calculation between dates
- ✅ Option to mark working-from-home during leave
- ✅ View own leave requests and their statuses
- ✅ View personal leave calendar
- ✅ "Request Leave" button in header and Leaves tab
- ✅ Track leave statistics (pending, approved, used days)

### 2. For Admins
- ✅ View all employee leave requests
- ✅ Filter requests by status (All, Pending, Approved, Rejected)
- ✅ Approve or reject leave requests
- ✅ Add admin notes during approval/rejection
- ✅ View full leave calendar with all employees' leaves
- ✅ See employee names on calendar events
- ✅ Track leave statistics per employee
- ✅ View color-coded leave types for quick identification

## Database Schema

### LeaveRequest Model
```javascript
- id: INTEGER (Primary Key)
- userId: INTEGER (Foreign Key - Employee)
- leaveType: ENUM['CASUAL', 'SICK', 'EMERGENCY', 'PERSONAL', 'ANNUAL', 'OTHER']
- startDate: DATE
- endDate: DATE
- numberOfDays: INTEGER
- reason: STRING (max 1000 chars)
- attachmentUrl: STRING (optional)
- status: ENUM['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
- approvedByAdminId: INTEGER (Foreign Key - Admin, optional)
- adminNotes: TEXT (optional)
- approvalDate: DATETIME (optional)
- isWorkingFromHome: BOOLEAN (default: false)
- createdAt: DATETIME
- updatedAt: DATETIME
```

## API Endpoints

### 1. GET `/api/leaves`
**Description:** Get all leave requests (filtered by role)
- **Employees:** See only their own leaves
- **Admins:** See all employees' leaves

**Query Parameters:**
- `status` (optional): PENDING, APPROVED, REJECTED, CANCELLED
- `userId` (optional, admin only): Filter by specific employee
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee": { "id": 1, "name": "John Doe", "email": "john@example.com" },
      "leaveType": "SICK",
      "startDate": "2024-02-15",
      "endDate": "2024-02-17",
      "numberOfDays": 3,
      "reason": "Medical appointment",
      "status": "PENDING",
      "isWorkingFromHome": false,
      "createdAt": "2024-02-10T10:00:00Z"
    }
  ]
}
```

### 2. GET `/api/leaves/:id`
**Description:** Get specific leave request details
- Users can only access their own leaves
- Admins can access any leave request

**Response:** Single leave request object

### 3. POST `/api/leaves`
**Description:** Create new leave request

**Request Body:**
```json
{
  "leaveType": "CASUAL",
  "startDate": "2024-02-20",
  "endDate": "2024-02-22",
  "reason": "Taking a break",
  "isWorkingFromHome": false
}
```

**Validation Rules:**
- startDate and endDate must be in the future
- startDate cannot be after endDate
- startDate must be at least 7 days in future (except for EMERGENCY type)
- Reason is required
- numberOfDays is auto-calculated

**Response:**
```json
{
  "success": true,
  "message": "Leave request created successfully",
  "data": { /* Leave request object */ }
}
```

### 4. PUT `/api/leaves/:id/approve`
**Description:** Admin approves or rejects a leave request
- **Admin-Only Endpoint**

**Request Body:**
```json
{
  "action": "approve", // or "reject"
  "adminNotes": "Approved - enjoy your break"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Leave request approved",
  "data": { /* Updated leave request */ }
}
```

### 5. PUT `/api/leaves/:id/cancel`
**Description:** Employee cancels their own pending leave request

**Response:**
```json
{
  "success": true,
  "message": "Leave request cancelled",
  "data": { /* Updated leave request */ }
}
```

### 6. GET `/api/leaves/calendar/dates`
**Description:** Get leave dates formatted for calendar view
- Employees see only their leaves
- Admins see all employees' leaves

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employeeName": "John Doe",
      "startDate": "2024-02-15",
      "endDate": "2024-02-17",
      "leaveType": "SICK",
      "status": "APPROVED"
    }
  ]
}
```

### 7. GET `/api/leaves/stats/:userId`
**Description:** Get leave statistics for a user
- Users can access only their own stats
- Admins can access any user's stats

**Response:**
```json
{
  "success": true,
  "data": {
    "totalApprovedDays": 10,
    "pendingRequests": 2,
    "rejectedRequests": 1,
    "leaveTypeBreakdown": {
      "CASUAL": 5,
      "SICK": 3,
      "PERSONAL": 2
    }
  }
}
```

## Frontend Components

### 1. LeaveCalendar Component
**Location:** `components/LeaveCalendar.tsx`

**Features:**
- Month navigation (previous/next buttons)
- 7-day grid layout (Sun-Sat)
- Color-coded leave events by type
- Employee name display for admins
- Date range highlighting for multi-day leaves
- Legend showing all leave types
- Click handler for date selection

**Color Coding:**
- **EMERGENCY:** Red (#ef4444)
- **SICK:** Orange (#f97316)
- **CASUAL:** Blue (#3b82f6)
- **PERSONAL:** Purple (#a855f7)
- **ANNUAL:** Green (#22c55e)
- **OTHER:** Gray (#6b7280)

**Props:**
```typescript
interface LeaveCalendarProps {
  token: string;
  isAdmin: boolean;
  userId: number;
  onDateClick?: (date: string) => void;
}
```

### 2. LeaveRequestModal Component
**Location:** `components/LeaveRequestModal.tsx`

**Features:**
- Leave type selector dropdown
- Start date picker (must be future date)
- End date picker
- Auto-calculated day count
- Reason textarea (500 char limit)
- Working-from-home checkbox
- Form validation
- Success/error messaging
- Proper date validation

**Props:**
```typescript
interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: () => void;
}
```

### 3. LeaveRequestsList Component
**Location:** `components/LeaveRequestsList.tsx`

**Features:**
- Filterable by status (ALL, PENDING, APPROVED, REJECTED)
- Status indicators with color coding
- Admin approval/rejection UI
- Admin notes display
- Employee name display (admin view)
- Duration in days
- Leave type badge
- Working-from-home indicator
- Approval modal with notes input
- Proper authorization checks

**Props:**
```typescript
interface LeaveRequestsListProps {
  token: string;
  isAdmin: boolean;
  userId: number;
  onRefresh: () => void;
}
```

## Navigation & UI Integration

### Sidebar Menu Item
- New "Leaves" menu item added to sidebar
- Available for both employees and admins
- Calendar icon for easy identification
- Positioned after "Timesheet"

### Header "Request Leave" Button
- Blue button with Calendar icon
- Only shown for employees (non-admins)
- Located between "Sessions" and "Logout"
- Responsive - text hidden on mobile
- Triggers LeaveRequestModal

### Leaves Tab Content
- Calendar view on the left (2/3 width on desktop)
- Quick stats panel on the right (1/3 width)
  - Pending Requests count
  - Approved Leaves count
  - Used Days This Year
- LeaveRequestsList below calendar
- "Request Leave" button in tab header

## Usage Workflows

### Employee Requesting Leave

1. **Navigate to Leaves Tab**
   - Click "Leaves" in sidebar
   - Or use "Request Leave" button in header

2. **Submit Leave Request**
   - Click "Request Leave" button
   - Select leave type
   - Choose start and end dates
   - Enter reason
   - Optional: Mark working-from-home
   - Click Submit
   - See success notification

3. **Track Request Status**
   - View request in LeaveRequestsList
   - See status (PENDING → APPROVED/REJECTED)
   - View admin notes if any
   - Can cancel if still PENDING

4. **View Leave Calendar**
   - See approved leaves on calendar
   - View leave type colors
   - Track planned vacation dates

### Admin Approving/Rejecting Leaves

1. **Navigate to Leaves Tab**
   - Click "Leaves" in sidebar

2. **Review Requests**
   - View all pending requests in list
   - Filter by status as needed
   - See employee name, dates, reason

3. **Approve or Reject**
   - Click "Approve" or "Reject" button
   - Enter admin notes if applicable
   - Confirm action
   - Status updates to APPROVED/REJECTED

4. **View Calendar**
   - See all employees' approved leaves
   - Employee names visible on events
   - Color-coded by leave type
   - Plan team coverage

## Validation Rules

### Date Validation
- Start date must be in the future
- End date must be on or after start date
- Non-emergency leaves need 7-day advance notice
- Emergency leaves override advance notice requirement

### Field Validation
- Leave type is required
- Dates are required
- Reason is required (max 1000 chars)
- Number of days auto-calculated correctly

### Authorization
- Employees see only their own leaves
- Employees can only cancel their own pending leaves
- Admins see all leaves
- Only admins can approve/reject requests

## Status Transitions

```
PENDING → APPROVED (via admin approval)
       → REJECTED (via admin rejection)
       → CANCELLED (via employee cancellation, only from PENDING)

APPROVED → (final, cannot be changed)
REJECTED → (final, cannot be changed)
CANCELLED → (final, cannot be changed)
```

## Error Handling

### Client-Side Validation
- Date range validation
- Required field checks
- Character limit enforcement
- Advance notice validation

### Server-Side Validation
- Authentication check
- Authorization check
- Date format validation
- Advance notice enforcement
- Business logic validation

### Error Messages
- Clear, user-friendly error messages
- Specific validation error details
- Server error handling with try-catch
- Proper HTTP status codes

## Database Relationships

```
User (1) ──→ (∞) LeaveRequest
├─ as 'employee' (userId)
└─ as 'approvedByAdmin' (approvedByAdminId)
```

## Future Enhancement Opportunities

1. **Email Notifications**
   - Notify employee when request is approved/rejected
   - Notify admin of pending requests
   - Notify team of upcoming leaves

2. **Leave Quotas**
   - Set annual quota per leave type
   - Track usage against quota
   - Restrict requests exceeding quota

3. **Team Coverage**
   - Show team member leave coverage
   - Alert on critical coverage gaps
   - Suggest coverage alternatives

4. **Leave Policies**
   - Different policies per department
   - Different quotas per employee level
   - Carryover rules

5. **Reporting**
   - Leave utilization reports
   - Department-level leave analytics
   - Trend analysis

6. **Integration**
   - Calendar sync (Google Calendar, Outlook)
   - Slack notifications
   - Email notifications on approval/rejection

## Testing Checklist

- [ ] Employee can request leave
- [ ] Date validation works correctly
- [ ] Day calculation is accurate
- [ ] Admin can see all requests
- [ ] Admin can approve/reject with notes
- [ ] Employee can see only their leaves
- [ ] Calendar displays correctly
- [ ] Status filters work
- [ ] Mobile responsiveness
- [ ] Error messages display properly
- [ ] Advance notice validation works
- [ ] Working-from-home toggle works

## Troubleshooting

### Leave request not appearing
- Check network tab for 401/403 errors
- Verify authentication token is valid
- Ensure leave is within correct date range

### Calendar not loading
- Check API response in network tab
- Verify token is valid
- Check browser console for errors

### Admin approval not working
- Ensure user has ADMIN role
- Check admin notes are provided
- Verify token and permissions

## Contact & Support

For issues or questions regarding the leave management system, please refer to:
- Backend: `server/routes/leaves.js`
- Frontend: `components/LeaveCalendar.tsx`, `components/LeaveRequestModal.tsx`, `components/LeaveRequestsList.tsx`
- Types: `types.ts`
