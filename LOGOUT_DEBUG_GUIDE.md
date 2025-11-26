# Logout Debugging Guide

## Issue
Logout not working properly - local storage not being cleared.

## Solution Implemented

### Enhanced Logout Flow

The logout function now follows a comprehensive 6-step process:

#### Step 1: Backend API Call
```typescript
await api.post('/auth/logout');
```
- Notifies backend of logout
- Continues even if this fails

#### Step 2: Clear API Headers
```typescript
setAuthToken('');
```
- Removes Authorization header from axios
- Prevents future API calls with old token

#### Step 3: Clear AsyncStorage (Double Method)
```typescript
// Method 1: Storage utility
await storage.clearAll();

// Method 2: Direct AsyncStorage clear (nuclear option)
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
await AsyncStorage.clear();
```
- Uses BOTH methods to ensure complete clearing
- `storage.clearAll()` removes specific keys
- `AsyncStorage.clear()` removes EVERYTHING

#### Step 4: Verification
```typescript
const token = await storage.getToken();
const isLoggedIn = await storage.isLoggedIn();
const userData = await storage.getUserData();
const userRole = await storage.getUserRole();

console.log('=== VERIFICATION ===');
console.log('Token:', token);
console.log('IsLoggedIn:', isLoggedIn);
console.log('UserData:', userData);
console.log('UserRole:', userRole);
```
- Checks if storage was actually cleared
- Logs warning if any data remains

#### Step 5: Wait Period
```typescript
await new Promise(resolve => setTimeout(resolve, 500));
```
- 500ms delay to ensure async operations complete
- Gives AsyncStorage time to finish clearing

#### Step 6: Navigation
```typescript
router.replace('/welcome');
```
- Navigates to welcome screen
- Uses `replace` to prevent back navigation

## Console Logs to Watch

### During Logout:
```
=== LOGOUT PROCESS STARTED ===
✓ Backend logout successful
✓ Auth token cleared from API headers
✓ Storage.clearAll() completed
✓ AsyncStorage.clear() completed
=== VERIFICATION ===
Token: null
IsLoggedIn: false
UserData: null
UserRole: null
✓ Storage verification passed - all clear
✓ Wait completed
→ Navigating to welcome screen...
=== LOGOUT COMPLETE ===
```

### On App Restart (index.tsx):
```
=== AUTH CHECK STARTED ===
Auth Status:
- isLoggedIn: false
- token: null
- hasRole: null
- isPinSet: false
→ User not logged in, navigating to /welcome
  Reason: isLoggedIn=false, token=false
=== AUTH CHECK COMPLETE ===
```

## Testing Steps

### 1. Login as Buyer
1. Open the app
2. Login with buyer credentials
3. You should see the marketplace

### 2. Navigate to Settings
1. Click profile icon (top right)
2. Click settings icon
3. You should see the settings page

### 3. Logout
1. Scroll to bottom
2. Click "Logout" button
3. Confirm logout in dialog
4. **Watch the console logs**

### 4. Verify Logout
After clicking logout, check:
- [ ] You see all the logout console logs
- [ ] Verification shows all values as null/false
- [ ] You're redirected to welcome screen
- [ ] You can't go back to marketplace

### 5. Restart App
1. Close the app completely
2. Reopen the app
3. **Watch the console logs**
4. You should see auth check logs
5. You should be on welcome screen

### 6. Try to Login Again
1. Click "Get Started"
2. Login with same credentials
3. Should work normally

## Common Issues & Solutions

### Issue 1: Still logged in after logout
**Symptoms:**
- Logout appears to work
- But reopening app shows you're still logged in

**Check:**
1. Look at console logs during logout
2. Check if verification shows null values
3. Check if AsyncStorage.clear() succeeded

**Solution:**
- The new implementation uses `AsyncStorage.clear()` which removes EVERYTHING
- This is the nuclear option and should work

### Issue 2: Console shows storage not cleared
**Symptoms:**
```
⚠ WARNING: Storage not fully cleared!
Token: some_token_value
```

**Solution:**
1. Check if AsyncStorage.clear() threw an error
2. Try manually clearing:
   ```typescript
   const AsyncStorage = require('@react-native-async-storage/async-storage').default;
   await AsyncStorage.clear();
   ```

### Issue 3: Redirects back to home after logout
**Symptoms:**
- Logout works
- But immediately redirects to home/marketplace

**Check:**
1. Look at index.tsx auth check logs
2. See what values it's finding

**Solution:**
- The auth check now has detailed logging
- It will show exactly why it's logging you back in
- Most likely: storage not actually cleared

### Issue 4: Error during logout
**Symptoms:**
```
✗ LOGOUT ERROR: [error message]
```

**Solution:**
1. Check the error message
2. Most common: AsyncStorage permission issue
3. Try restarting the app/emulator

## Files Modified

### 1. `frontend/app/buyer-settings.tsx`
- Enhanced `handleLogout` function
- Added 6-step logout process
- Added detailed logging
- Added verification step
- Uses both storage.clearAll() and AsyncStorage.clear()

### 2. `frontend/app/index.tsx`
- Added detailed logging to auth check
- Shows exactly why user is/isn't logged in
- Helps debug logout issues

## Storage Keys Cleared

When `AsyncStorage.clear()` is called, it removes ALL keys including:

- `userRole` - User's role
- `userPin` - User's PIN
- `userData` - User data
- `isPinSet` - PIN set status
- `isLoggedIn` - Login status
- `authToken` - JWT token
- **Plus any other keys that might exist**

## API Headers Cleared

When `setAuthToken('')` is called:
```typescript
// Before
api.defaults.headers.common['Authorization'] = 'Bearer token123...'

// After
api.defaults.headers.common['Authorization'] = undefined
```

## Verification Checklist

After implementing this fix:

- [ ] Logout shows all 6 steps in console
- [ ] Verification shows all null values
- [ ] Welcome screen appears after logout
- [ ] Can't navigate back to marketplace
- [ ] Restarting app shows auth check logs
- [ ] Auth check shows isLoggedIn=false, token=null
- [ ] Welcome screen appears on restart
- [ ] Can login again successfully

## Advanced Debugging

If logout still doesn't work, add this to your logout function:

```typescript
// After AsyncStorage.clear()
const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const allKeys = await AsyncStorage.getAllKeys();
console.log('All remaining keys:', allKeys);

if (allKeys.length > 0) {
  const allData = await AsyncStorage.multiGet(allKeys);
  console.log('All remaining data:', allData);
}
```

This will show you EXACTLY what's left in storage.

## Expected Behavior

### Before Logout:
- User is on marketplace/settings
- Storage contains: token, userData, userRole, isLoggedIn=true
- API headers contain Authorization token

### During Logout:
- Backend notified
- API headers cleared
- Storage cleared (twice)
- Verification confirms clearing
- 500ms wait
- Navigation to welcome

### After Logout:
- User on welcome screen
- Storage is empty
- API headers have no Authorization
- Can't go back to marketplace
- Must login again

### On App Restart:
- Auth check runs
- Finds no token, no isLoggedIn
- Navigates to welcome
- User must login

## Notes

1. **AsyncStorage.clear() is aggressive** - It removes EVERYTHING, not just auth data
2. **This is intentional** - We want to ensure complete logout
3. **Users will lose any cached data** - This is acceptable for security
4. **Detailed logging** - Makes debugging much easier
5. **Verification step** - Catches issues before navigation

## Support

If logout still doesn't work after this implementation:

1. Share the complete console logs
2. Share the verification output
3. Check if AsyncStorage.clear() throws an error
4. Try on a different device/emulator
5. Check React Native AsyncStorage version

The new implementation should work in 99% of cases because:
- It uses the nuclear option (AsyncStorage.clear())
- It verifies the clearing worked
- It waits for async operations to complete
- It has detailed logging for debugging
