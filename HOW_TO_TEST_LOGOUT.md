# How to Test Logout - Quick Guide

## Problem
The app isn't picking up code changes because React Native/Expo needs to reload.

## Solution: Reload the App

### Method 1: Shake to Reload (Recommended)
1. **On Physical Device**: Shake your phone
2. **On Emulator**: 
   - Android: Press `Ctrl + M` (Windows) or `Cmd + M` (Mac)
   - iOS: Press `Cmd + D`
3. A menu will appear
4. Click **"Reload"**

### Method 2: Press 'R' in Terminal
1. Go to the terminal where `npm start` is running (frontend)
2. Press `r` key
3. This will reload the app

### Method 3: Restart Metro Bundler
1. Stop the frontend server (Ctrl+C)
2. Run `npm start` again
3. Wait for it to load
4. Open the app again

## After Reloading

### You Should See:
1. **On App Start**: Console logs from `index.tsx`:
   ```
   === AUTH CHECK STARTED ===
   Auth Status:
   - isLoggedIn: true
   - token: eyJhbG...
   - hasRole: buyer
   ```

2. **On Logout**: Console logs from `buyer-settings.tsx`:
   ```
   === LOGOUT PROCESS STARTED ===
   ✓ Backend logout successful
   ✓ Auth token cleared
   🗑️ Starting storage clear...
   ✓ Specific keys removed
   ✓ AsyncStorage completely cleared
   📋 Remaining keys: 0
   ✅ Storage is completely empty
   === LOGOUT COMPLETE ===
   ```

## Quick Test

### Step 1: Open Developer Tools
**On Android Emulator:**
- Press `Ctrl + M`
- Select "Debug"
- Open Chrome DevTools (F12)
- Go to Console tab

**On iOS Simulator:**
- Press `Cmd + D`
- Select "Debug"
- Safari → Develop → Simulator → JSContext

**On Physical Device:**
- Shake device
- Select "Debug"
- Follow above steps

### Step 2: Reload App
- Press `r` in terminal OR shake device and click Reload

### Step 3: Test Logout
1. Login as buyer
2. Go to Settings
3. Click Logout
4. **Watch the console** - you should see all the logs

## If Still Not Working

### Check 1: Is Metro Bundler Running?
Look for this in terminal:
```
Metro waiting on exp://192.168.x.x:8081
```

### Check 2: Is App Connected?
You should see:
```
› Opening exp://192.168.x.x:8081 on Android
```

### Check 3: Clear Cache
```bash
cd frontend
npm start -- --clear
```

## Manual Logout Test

If you want to test logout manually without the UI:

### Add This to buyer-marketplace.tsx (temporarily):

```typescript
// Add at the top with other imports
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add this button somewhere visible (e.g., in the header)
<TouchableOpacity 
  onPress={async () => {
    console.log('TEST LOGOUT STARTED');
    await AsyncStorage.clear();
    console.log('Storage cleared');
    router.replace('/welcome');
  }}
  style={{ padding: 10, backgroundColor: 'red' }}
>
  <Text style={{ color: 'white' }}>TEST LOGOUT</Text>
</TouchableOpacity>
```

This will give you a red button that immediately clears storage and navigates to welcome.

## Expected Console Output

### When App Starts:
```
=== AUTH CHECK STARTED ===
Auth Status:
- isLoggedIn: true
- token: eyJhbGciOiJIUzI1NiIsI...
- hasRole: buyer
- isPinSet: false
→ User is logged in, setting auth token
→ Navigating to /home (role: buyer)
=== AUTH CHECK COMPLETE ===
```

### When You Logout:
```
=== LOGOUT PROCESS STARTED ===
✓ Backend logout successful
✓ Auth token cleared from API headers
🗑️ Starting storage clear...
✓ Specific keys removed
✓ AsyncStorage completely cleared
📋 Remaining keys: 0
✅ Storage is completely empty
✓ Wait completed
→ Navigating to welcome screen...
=== LOGOUT COMPLETE ===
```

### When App Restarts After Logout:
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

## Troubleshooting

### "Nothing in console"
**Cause**: App not reloaded
**Fix**: Shake device → Reload OR press `r` in terminal

### "Old code still running"
**Cause**: Cache not cleared
**Fix**: 
```bash
cd frontend
npm start -- --clear
```

### "Can't see console logs"
**Cause**: Debug mode not enabled
**Fix**: 
1. Shake device
2. Click "Debug"
3. Open Chrome DevTools

### "Logout button not responding"
**Cause**: Code not updated
**Fix**: 
1. Stop frontend server
2. `npm start`
3. Reload app

## Quick Commands

```bash
# Reload app
# Press 'r' in the terminal where npm start is running

# Clear cache and restart
cd frontend
npm start -- --clear

# Check if changes are picked up
# Look for "Fast Refresh enabled" in terminal
```

## Summary

1. **Reload the app** (shake → reload OR press 'r')
2. **Open console** (shake → debug → Chrome DevTools)
3. **Test logout** (Settings → Logout)
4. **Watch console** for detailed logs
5. **Verify** storage is cleared (should see "0 remaining keys")

The code is correct, it just needs to be loaded into the app!
