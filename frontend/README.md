# Krishi Connect Frontend

Bilingual (English + Hindi) farmer marketplace mobile application built with React Native and Expo.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📱 Features

- Bilingual support (English/Hindi)
- Complete authentication flow
- Role-based access (Farmer/Buyer)
- 4-digit PIN security
- Modern UI with animations
- Local data storage

## 📁 Project Structure

```
frontend/
├── app/                 # Screen components
├── components/          # Reusable components
├── constants/           # Constants and themes
├── i18n/               # Internationalization
├── utils/              # Utilities
└── package.json        # Dependencies
```

## 🛠️ Technologies

- React Native
- Expo
- TypeScript
- i18n-js
- AsyncStorage
- React Native Reanimated

## 📖 Documentation

- See [SETUP.md](./SETUP.md) for detailed setup instructions
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues

## 🌐 Language Support

- English (en)
- Hindi (hi)

Toggle language from Welcome or Home screen.

## 📝 Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on Web
- `npm run lint` - Lint code

## 🔧 Troubleshooting

If you encounter issues:

1. Clear cache: `npm start -- --reset-cache`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📱 Testing

1. Welcome screen → Sign Up
2. Fill form → Select role
3. Set PIN → Home screen
4. Test language toggle
5. Test logout and login flow

---

For more information, see the main [README.md](../README.md) file.
