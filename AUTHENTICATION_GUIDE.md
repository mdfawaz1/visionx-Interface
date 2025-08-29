# VisionX Frontend Authentication Guide

## Overview
The VisionX frontend now includes a complete authentication system with JWT tokens, role-based access control, and multi-tenancy support.

## Initial Setup

### 1. Environment Variables
Create a `.env` file in the frontend root:
```
REACT_APP_API_URL=http://localhost:26000/api/v1
```

### 2. First Time Setup
When you first run the application:
1. Navigate to http://localhost:3000/login
2. The system will detect no master user exists
3. Fill out the master account creation form:
   - Username
   - Email
   - Password (min 8 characters)
   - Organization Name
4. After creation, login with your master credentials

## Authentication Flow

### Login Process
1. User enters credentials on login page
2. System authenticates against backend
3. Receives JWT access token (15 min) and refresh token (7 days)
4. Tokens stored in localStorage
5. User redirected to appropriate page based on permissions

### Token Management
- Access tokens automatically included in all API requests
- Tokens refresh automatically before expiration
- If refresh fails, user redirected to login

## User Roles & Permissions

### Roles
1. **Master** - Full system access
2. **Admin** - Tenant-level administration
3. **User** - Standard user with configurable permissions

### Permissions
- `canAccessCustomModels` - Create and manage custom models
- `canManageUsers` - Access user management dashboard
- `canViewPages` - Array of allowed pages

### Page Access
Pages can be restricted by:
- Role requirement
- Specific permission
- Page-level access in canViewPages array

## Components

### AuthContext
Provides authentication state and methods:
```javascript
const { 
  user,           // Current user object
  isAuthenticated,// Authentication status
  login,          // Login function
  logout,         // Logout function
  hasPermission,  // Check specific permission
  canAccessPage,  // Check page access
  isMaster,       // Check if master user
  isAdmin         // Check if admin or master
} = useAuth();
```

### ProtectedRoute
Wraps routes requiring authentication:
```javascript
<ProtectedRoute requiredPermission="canAccessCustomModels">
  <CustomModelsList />
</ProtectedRoute>

<ProtectedRoute requiredPage="monitoring">
  <LiveMonitor />
</ProtectedRoute>

<ProtectedRoute requiredRole={['master', 'admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

## User Management

### Creating Users (Master/Admin)
1. Navigate to User Management (if permitted)
2. Click "Add User"
3. Fill out user details:
   - Basic info (username, email, password)
   - Role assignment
   - Permissions configuration
   - Page access selection
   - Session limits
4. User receives credentials and can login

### Managing Permissions
- Master users can manage all users
- Admin users can manage users in their tenant
- Permissions take effect immediately
- Users with expired sessions cannot login

## Security Features

### Session Management
- Configurable session duration per user
- Account expiration dates
- Active/inactive status
- Session timeout handling

### Multi-Tenancy
- Users isolated by tenant
- Custom models per tenant
- Tenant-specific configurations
- Master users can access all tenants

## Troubleshooting

### Common Issues

1. **"No master user found" on every login**
   - Backend might not be running
   - Check API URL in .env file
   - Verify MongoDB connection

2. **Token expired errors**
   - Clear localStorage
   - Login again
   - Check system time sync

3. **Permission denied**
   - Verify user has required permissions
   - Check if session expired
   - Contact administrator

### Debug Mode
Check browser console for:
- Authentication errors
- Token refresh attempts
- API call failures
- Permission checks

## API Integration

All API calls now include authentication:
```javascript
import api from './api';

// Automatically includes auth header
const response = await api.get('/custom-models');
```

The API service handles:
- Token injection
- Automatic refresh
- Error handling
- Unauthorized redirects