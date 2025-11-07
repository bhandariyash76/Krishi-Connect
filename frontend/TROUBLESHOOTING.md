# Troubleshooting Guide

## Common Issues and Solutions

### 1. App Won't Start

**Error: Module not found or import errors**
- Solution: Make sure all dependencies are installed
  ```bash
  cd frontend
  npm install
  ```

### 2. Metro Bundler Errors

**Error: Cannot resolve module**
- Solution: Clear cache and restart
  ```bash
  npm start -- --reset-cache
  ```

### 3. TypeScript Errors

**Error: Type errors**
- Solution: Check TypeScript configuration
  ```bash
  npx tsc --noEmit
  ```

### 4. Android/iOS Build Issues

**Error: Build fails**
- Solution: Clear build cache
  ```bash
  # For Android
  cd android && ./gradlew clean && cd ..
  
  # For iOS
  cd ios && pod install && cd ..
  ```

### 5. AsyncStorage Not Working

**Error: Storage operations fail**
- Solution: Make sure @react-native-async-storage/async-storage is properly installed
  ```bash
  npm install @react-native-async-storage/async-storage
  ```

### 6. Navigation Issues

**Error: Screen not found**
- Solution: Make sure all screen files exist in `app/` directory
- Check that file names match route names exactly

### 7. Language Not Changing

**Issue: Language toggle doesn't update UI**
- Solution: The app uses i18n-js. Make sure translations are properly loaded
- Check that language preference is saved in AsyncStorage

## Quick Fix Commands

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Clear cache and start
npm start -- --reset-cache

# For Android
npm run android

# For iOS
npm run ios

# For Web
npm run web
```

## File Structure Check

Make sure these files exist:
- `app/index.tsx` - Initial routing
- `app/welcome.tsx` - Welcome screen
- `app/login.tsx` - Login screen
- `app/signup.tsx` - Signup screen
- `app/role-selection.tsx` - Role selection
- `app/set-pin.tsx` - Set PIN screen
- `app/pin-unlock.tsx` - PIN unlock screen
- `app/home.tsx` - Home screen
- `i18n/index.ts` - i18n configuration
- `utils/storage.ts` - Storage utilities
- `constants/colors.ts` - App colors
- `components/ui/Button.tsx` - Button component
- `components/ui/Input.tsx` - Input component
- `components/ui/Card.tsx` - Card component
- `components/LanguageToggle.tsx` - Language toggle

