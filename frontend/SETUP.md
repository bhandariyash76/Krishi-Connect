# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Node.js
Make sure you have Node.js installed (v16 or higher).
Download from: https://nodejs.org/

### 2. Clone the Repository
```bash
git clone https://github.com/bhandariyash76/Krishi-Connect.git
cd Krishi-Connect/frontend
```

### 3. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- i18n-js
- react-native-localize
- @react-native-async-storage/async-storage
- And all other dependencies

### 4. Start the Development Server
```bash
npm start
```

### 5. Run on Your Device/Emulator

**Option A: Use Expo Go App (Recommended for Testing)**
1. Install Expo Go on your phone from App Store/Play Store
2. Scan the QR code shown in the terminal
3. App will load on your phone

**Option B: Use Emulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Press `w` for Web browser

## Common Issues and Fixes

### Issue: "npm install" fails
**Fix**: 
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Module not found" errors
**Fix**: Make sure you're in the `frontend` directory and all dependencies are installed.
```bash
cd frontend
npm install
```

### Issue: Metro bundler crashes
**Fix**: Clear cache and restart
```bash
npm start -- --reset-cache
```

### Issue: App shows blank screen
**Fix**: 
1. Check console for errors
2. Make sure all files are present
3. Clear cache: `npm start -- --reset-cache`
4. Restart the development server

### Issue: Language toggle not working
**Fix**: This is normal on first run. Language preference is saved in AsyncStorage after first toggle.

## Verification Checklist

Before running, make sure:
- ✅ Node.js is installed (check with `node --version`)
- ✅ You're in the `frontend` directory
- ✅ All dependencies are installed (`npm install` completed successfully)
- ✅ No errors in terminal after `npm start`

## Need Help?

1. Check the main README.md file
2. Check TROUBLESHOOTING.md in the frontend directory
3. Open an issue on GitHub: https://github.com/bhandariyash76/Krishi-Connect/issues

## Testing the App

After successful setup:
1. You should see the Welcome screen with 🌾 emoji
2. Click "Sign Up" to create an account
3. Fill in the form and submit
4. Select your role (Farmer or Buyer)
5. Set a 4-digit PIN
6. You'll reach the Home screen

If all steps work, the setup is successful! 🎉

