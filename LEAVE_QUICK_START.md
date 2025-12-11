# Leave Management System - Quick Reference

## 🎯 What's New

Your app now has a **complete leave management system** where employees can request leaves and admins can approve them.

## 📋 Quick Start

### For Employees:
1. Click **"Leaves"** in the sidebar
2. Click **"Request Leave"** button
3. Fill in the form:
   - Select leave type (Casual, Sick, Emergency, Personal, Annual)
   - Choose start and end dates
   - Add a reason
   - Optional: Mark "Working from Home"
4. Submit and wait for admin approval
5. View your approved leaves on the calendar

### For Admins:
1. Click **"Leaves"** in the sidebar
2. See all pending leave requests
3. Click **"Approve"** or **"Reject"**
4. Add optional admin notes
5. View the calendar to see all team members' approved leaves

## 📂 Files Created/Modified

### Backend
- ✅ `server/models/LeaveRequest.js` - New database model
- ✅ `server/routes/leaves.js` - New API endpoints (7 total)
- ✅ `server/models/index.js` - Added LeaveRequest relationships
- ✅ `server/index.js` - Registered leave routes

### Frontend
- ✅ `components/LeaveCalendar.tsx` - New calendar component
- ✅ `components/LeaveRequestModal.tsx` - New request form
- ✅ `components/LeaveRequestsList.tsx` - New requests list
- ✅ `components/Sidebar.tsx` - Added "Leaves" menu item
- ✅ `App.tsx` - Integrated all components
- ✅ `types.ts` - Added leave types and interfaces

### Documentation
- ✅ `LEAVE_MANAGEMENT_GUIDE.md` - Full technical guide
- ✅ `LEAVE_SYSTEM_COMPLETE.md` - Implementation summary

## 🌟 Key Features

| Feature | Employee | Admin |
|---------|----------|-------|
| Request leaves | ✅ | ✅ |
| View own leaves | ✅ | ✅ |
| View team calendar | ❌ | ✅ |
| Approve/reject | ❌ | ✅ |
| Add admin notes | ❌ | ✅ |
| See request history | ✅ | ✅ |
| Track statistics | ✅ | ✅ |
| Cancel pending | ✅ | ❌ |

## 🎨 Leave Types & Colors

- 🔴 **Emergency** (Red) - Urgent matters
- 🟠 **Sick** (Orange) - Health-related
- 🔵 **Casual** (Blue) - Regular vacation
- 🟣 **Personal** (Purple) - Personal matters
- 🟢 **Annual** (Green) - Paid leave
- ⚫ **Other** (Gray) - Other types

## 📱 Navigation

```
Sidebar
├─ Dashboard
├─ My Tasks
├─ Timesheet
├─ Leaves ← NEW!
├─ Projects (Admin only)
├─ Employees (Admin only)
├─ Reports
└─ Settings

Header
├─ Search
├─ Notifications (Admin)
├─ Sessions
├─ Request Leave ← NEW! (for employees)
└─ Logout
```

## 🔧 API Endpoints

```
GET    /api/leaves              → List all requests
GET    /api/leaves/:id          → Get specific request
POST   /api/leaves              → Create new request
PUT    /api/leaves/:id/approve  → Approve/reject (Admin)
PUT    /api/leaves/:id/cancel   → Cancel request (Employee)
GET    /api/leaves/calendar/dates → Calendar data
GET    /api/leaves/stats/:userId → Statistics
```

## ✅ Validation Rules

- ✅ Dates must be in the future
- ✅ Non-emergency needs 7-day advance notice
- ✅ Emergency leaves can be same-day
- ✅ Reason is required (max 1000 characters)
- ✅ Start date must be before end date
- ✅ Days calculated automatically

## 📊 Leave Request Statuses

```
PENDING ────→ APPROVED  (Admin approved)
    ↓
    └─→ REJECTED  (Admin rejected)
    └─→ CANCELLED (Employee cancelled)
```

## 🔐 Security

- ✅ JWT token required for all endpoints
- ✅ Role-based access control (employees vs admins)
- ✅ Users can only see their own leaves (employees)
- ✅ Admins can see all leaves
- ✅ Input validation on server side
- ✅ Proper error handling

## 📝 Database Schema

```sql
LeaveRequest
├─ id (primary key)
├─ userId (foreign key to User)
├─ leaveType (ENUM)
├─ startDate
├─ endDate
├─ numberOfDays
├─ reason (text)
├─ status (ENUM)
├─ approvedByAdminId (foreign key to User)
├─ adminNotes
├─ isWorkingFromHome (boolean)
└─ timestamps
```

## 🎬 Usage Example

### Employee Requesting Leave:
```
1. Click "Leaves" → See calendar and requests
2. Click "Request Leave" → Open form
3. Select "Sick" leave type
4. Pick dates: Feb 15-17
5. Reason: "Doctor appointment"
6. Click Submit
7. Status shows "PENDING"
```

### Admin Approving:
```
1. Click "Leaves" → See all requests
2. Find John's request (status: PENDING)
3. Click "Approve"
4. Add notes: "Approved - take care"
5. Click Confirm
6. Status changes to "APPROVED"
7. Shows on calendar automatically
```

## 🚀 Status: Production Ready

- ✅ All components implemented
- ✅ All endpoints working
- ✅ All validations in place
- ✅ No errors or warnings
- ✅ Type-safe code
- ✅ Database relationships set up
- ✅ Navigation integrated
- ✅ UI polished
- ✅ Ready to deploy

## 📱 Responsive Design

- ✅ Desktop: Full calendar + stats + list
- ✅ Tablet: Stacked layout
- ✅ Mobile: Single column, compact buttons
- ✅ Header button text hidden on mobile
- ✅ All components mobile-friendly

## 🔄 Data Flow

```
Employee Submits Request
    ↓
LeaveRequestModal → POST /api/leaves
    ↓
Backend Validates → Database saves
    ↓
LeaveRequestsList updated
    ↓
Admin Sees Pending Request
    ↓
Admin Clicks Approve → PUT /api/leaves/:id/approve
    ↓
Backend Updates Status → Database saved
    ↓
Employee Sees Approval
    ↓
LeaveCalendar Shows Event
```

## 🎓 Component Documentation

See `LEAVE_MANAGEMENT_GUIDE.md` for:
- Detailed API documentation
- Component prop specifications
- Database schema details
- Error handling examples
- Future enhancement ideas
- Testing checklist

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see Leaves tab | Refresh the page |
| Button doesn't work | Check if logged in |
| Form validation errors | Check date is in future |
| Can't approve as employee | Only admins can approve |
| Calendar not loading | Check network tab for errors |

## 📞 Support

For detailed information:
- **Backend code:** `server/routes/leaves.js`
- **Frontend code:** `components/Leave*.tsx`
- **Types:** `types.ts`
- **Full guide:** `LEAVE_MANAGEMENT_GUIDE.md`
- **Summary:** `LEAVE_SYSTEM_COMPLETE.md`

---

**Everything is ready to use! Start by clicking "Leaves" in your sidebar.** 🎉
