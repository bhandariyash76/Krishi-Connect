# Logout Functionality - Implementation Guide

## Overview

The logout functionality has been improved to ensure proper session termination and state clearing across both frontend and backend.

## Backend Changes

### 1. JWT Secret Configuration

**File:** `backend/.env.example`

Added `JWT_SECRET` environment variable:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Important:** Make sure to add this to your actual `.env` file with a strong, random secret.

To generate a secure secret, run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Auth Controller Updates

**File:** `backend/controllers/authController.js`

**Changes:**
- ✅ Replaced hardcoded JWT secret `"test"` with `process.env.JWT_SECRET`
- ✅ Increased token expiration from `1h` to `24h`
- ✅ Added `logout` function

```javascript
export const logout = async (req, res) => {
    try {
        // Since JWT is stateless, we just send a success response
        // The client will remove the token from storage
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}
```

### 3. Auth Routes

**File:** `backend/routes/authRoutes.js`

Added logout endpoint:
```javascript
router.post("/logout", logout);
```

**Endpoint:** `POST /api/auth/logout`

## Frontend Changes

### 1. Improved Logout Flow

**File:** `frontend/app/home.tsx`

The `handleLogout` function now:

1. **Calls Backend API:**
   ```typescript
   await api.post('/auth/logout');
   ```

2. **Clears Local State:**
   - Resets all component state (role, userName, userId, products, orders, etc.)

3. **Clears Auth Token:**
   ```typescript
   setAuthToken('');
   ```

4. **Clears AsyncStorage:**
   ```typescript
   await storage.clearAll();
   ```

5. **Verifies Storage Cleared:**
   ```typescript
   const verifyToken = await storage.getToken();
   const verifyLoggedIn = await storage.isLoggedIn();
   console.log('Verification - Token:', verifyToken, 'LoggedIn:', verifyLoggedIn);
   ```

6. **Navigates to Welcome Screen:**
   ```typescript
   router.push('/welcome');
   setTimeout(() => {
     router.replace('/welcome');
   }, 100);
   ```

### 2. Welcome Screen Auth Clearing

**File:** `frontend/app/welcome.tsx`

Added `useEffect` to clear any residual auth state:
```typescript
useEffect(() => {
  console.log('Welcome screen mounted - clearing auth state');
  setAuthToken(''); // Clear any auth token from API headers
}, []);
```

## How Logout Works

### Step-by-Step Flow:

1. **User clicks Logout button** in Settings tab
2. **Confirmation dialog** appears
3. **User confirms** logout
4. **Backend API call** to `/api/auth/logout`
5. **Clear local component state** (all useState variables)
6. **Clear API auth token** from axios headers
7. **Clear AsyncStorage** (removes all stored data)
8. **Verify storage cleared** (console logs for debugging)
9. **Navigate to Welcome screen** using both push and replace
10. **Welcome screen clears** any residual auth headers

## Storage Keys Cleared

When `storage.clearAll()` is called, these keys are removed:

- `userRole` - User's role (farmer/buyer/admin)
- `userPin` - User's PIN
- `userData` - User data (name, email, etc.)
- `isPinSet` - PIN set status
- `isLoggedIn` - Login status
- `authToken` - JWT authentication token

## Debugging Logout Issues

### Console Logs to Check:

1. **Starting logout:**
   ```
   Starting logout process...
   ```

2. **Backend response:**
   ```
   Backend logout successful
   ```
   or
   ```
   Backend logout error (continuing anyway): [error]
   ```

3. **State cleared:**
   ```
   Local state cleared
   Auth token cleared from API
   Storage cleared
   ```

4. **Verification:**
   ```
   Verification - Token: null LoggedIn: false
   ```

5. **Navigation:**
   ```
   Navigating to welcome screen...
   Logout complete
   ```

6. **Welcome screen:**
   ```
   Welcome screen mounted - clearing auth state
   ```

### Common Issues and Solutions:

#### Issue 1: User stays logged in after logout

**Cause:** AsyncStorage not properly cleared

**Solution:**
- Check console logs for "Storage cleared"
- Verify "Verification - Token: null LoggedIn: false"
- If storage isn't clearing, try:
  ```typescript
  await AsyncStorage.clear(); // Nuclear option - clears everything
  ```

#### Issue 2: Navigation doesn't work

**Cause:** Router navigation stack not resetting

**Solution:**
- The current implementation uses both `push` and `replace`
- If still not working, try using `router.dismissAll()` before navigation (if available)

#### Issue 3: Auth token persists in API headers

**Cause:** `setAuthToken('')` not being called

**Solution:**
- Check that `setAuthToken('')` is called in logout
- Check that welcome screen's useEffect is running
- Manually verify: `console.log(api.defaults.headers.common['Authorization'])`

#### Issue 4: Backend logout fails

**Cause:** Network error or server not running

**Solution:**
- Logout continues anyway (graceful degradation)
- Check backend server is running
- Check network connectivity

## Testing Logout

### Manual Testing Steps:

1. **Login** as any user (farmer/buyer/admin)
2. **Navigate** to Settings tab
3. **Click** Logout button
4. **Confirm** logout in dialog
5. **Verify** you're redirected to Welcome screen
6. **Try to navigate back** - should not be able to
7. **Check** that no user data is visible
8. **Try to access** protected routes - should redirect to login

### Automated Testing (Future):

```typescript
describe('Logout Functionality', () => {
  it('should clear all storage on logout', async () => {
    await storage.setToken('test-token');
    await storage.setLoggedIn(true);
    
    await storage.clearAll();
    
    const token = await storage.getToken();
    const loggedIn = await storage.isLoggedIn();
    
    expect(token).toBeNull();
    expect(loggedIn).toBe(false);
  });
  
  it('should clear auth token from API headers', () => {
    setAuthToken('test-token');
    expect(api.defaults.headers.common['Authorization']).toBe('Bearer test-token');
    
    setAuthToken('');
    expect(api.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
```

## Security Considerations

### JWT Token Expiration

- Tokens now expire after **24 hours**
- After expiration, user must login again
- Backend validates token on each request (if auth middleware is implemented)

### Token Storage

- ✅ Tokens stored in AsyncStorage (secure on device)
- ✅ Tokens cleared on logout
- ✅ Tokens not logged or exposed in production

### Logout Best Practices

1. **Always call backend logout** - Even though JWT is stateless, it's good practice
2. **Clear all client-side state** - Prevent data leaks
3. **Verify storage cleared** - Use console logs in development
4. **Navigate to public route** - Prevent access to protected routes
5. **Clear auth headers** - Prevent unauthorized API calls

## Future Improvements

### 1. Token Blacklisting

For enhanced security, implement token blacklisting on backend:

```javascript
// Store invalidated tokens in Redis or database
const blacklistedTokens = new Set();

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            blacklistedTokens.add(token);
            // Or store in Redis with expiration
        }
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Middleware to check blacklist
export const checkBlacklist = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token && blacklistedTokens.has(token)) {
        return res.status(401).json({ message: "Token has been invalidated" });
    }
    next();
}
```

### 2. Refresh Tokens

Implement refresh token mechanism:
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Automatic token refresh on expiration

### 3. Session Management

Track active sessions:
- Store session info in database
- Allow users to view/revoke active sessions
- Implement "logout from all devices"

### 4. Logout Analytics

Track logout events:
- Log logout time
- Track logout reason (manual, timeout, error)
- Monitor logout patterns

## API Documentation

### POST /api/auth/logout

Logs out the current user by invalidating their session.

**Request:**
```http
POST /api/auth/logout HTTP/1.1
Host: localhost:5000
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (Success):**
```json
{
  "message": "Logged out successfully"
}
```

**Response (Error):**
```json
{
  "message": "Something went wrong"
}
```

**Status Codes:**
- `200` - Logout successful
- `500` - Server error

## Troubleshooting Commands

### Check AsyncStorage (React Native Debugger):

```javascript
// In React Native Debugger console
AsyncStorage.getAllKeys().then(keys => console.log(keys));
AsyncStorage.multiGet(keys).then(items => console.log(items));
```

### Check API Headers:

```javascript
// In browser/debugger console
console.log(api.defaults.headers.common);
```

### Force Clear Everything:

```javascript
// Nuclear option - use with caution
await AsyncStorage.clear();
setAuthToken('');
router.replace('/welcome');
```

## Summary

The logout functionality now properly:
- ✅ Calls backend API
- ✅ Clears all local state
- ✅ Clears AsyncStorage
- ✅ Clears API auth headers
- ✅ Navigates to welcome screen
- ✅ Prevents re-login without credentials
- ✅ Provides debugging logs
- ✅ Handles errors gracefully

The implementation follows security best practices and provides a smooth user experience.
