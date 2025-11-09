# Krishi Connect - Farmer Marketplace App

A bilingual (English + Hindi) farmer marketplace mobile application built with React Native and Expo.

## 🌾 Features

- ✅ Bilingual support (English/Hindi) with language toggle
- ✅ Complete authentication flow (Login/Signup)
- ✅ Role-based access (Farmer/Buyer)
- ✅ 4-digit PIN security
- ✅ Modern, clean UI with green/white theme
- ✅ Smooth animations and transitions
- ✅ Local data storage with AsyncStorage

## 📱 Screens

1. **Welcome Screen** - App logo, tagline, and Login/Sign Up options
2. **Login Screen** - Email/Mobile and Password authentication
3. **Signup Screen** - User registration with form validation
4. **Role Selection** - Choose between Farmer (👨‍🌾) or Buyer (🛒)
5. **Set PIN** - Create a 4-digit PIN for account security
6. **PIN Unlock** - Enter PIN to access the app
7. **Home Screen** - Welcome message, language toggle, and logout

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Expo Go app on your phone (for testing on device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhandariyash76/Krishi-Connect.git
   cd Krishi-Connect
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the Expo development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (Mac only)
   - Press `w` for Web browser
   - Scan QR code with Expo Go app on your phone

## 📦 Project Structure

```
Krishi-Connect/
├── frontend/
│   ├── app/                    # Screen components
│   │   ├── welcome.tsx         # Welcome screen
│   │   ├── login.tsx           # Login screen
│   │   ├── signup.tsx          # Signup screen
│   │   ├── role-selection.tsx  # Role selection
│   │   ├── set-pin.tsx         # Set PIN screen
│   │   ├── pin-unlock.tsx      # PIN unlock screen
│   │   ├── home.tsx            # Home screen
│   │   └── _layout.tsx         # Root layout
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components
│   │   │   ├── Button.tsx      # Button component
│   │   │   ├── Input.tsx       # Input component
│   │   │   └── Card.tsx        # Card component
│   │   └── LanguageToggle.tsx  # Language toggle
│   ├── constants/              # Constants
│   │   └── colors.ts           # App color palette
│   ├── i18n/                   # Internationalization
│   │   └── index.ts            # i18n configuration
│   ├── utils/                  # Utilities
│   │   └── storage.ts          # AsyncStorage utilities
│   └── package.json            # Dependencies
└── backend/                    # Backend (if applicable)
```

## 🛠️ Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **i18n-js** - Internationalization
- **react-native-localize** - Locale detection
- **AsyncStorage** - Local data storage
- **React Native Reanimated** - Animations

## 🎨 Design

- **Color Palette**: Green and white theme (agricultural theme)
- **UI Style**: Modern, card-based design with rounded corners
- **Animations**: Smooth fade and slide transitions
- **Typography**: Clean, readable fonts with proper sizing

## 🌐 Language Support

- **English** (en)
- **Hindi** (hi)

Language can be toggled from the Welcome screen and Home screen.

## 📝 Available Scripts

```bash
# Start Expo development server
npm start

# Start with cache cleared
npm start -- --reset-cache

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Lint code
npm run lint
```

## 🔧 Troubleshooting

### Issue: Module not found
**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Metro bundler errors
**Solution**: Clear Expo cache
```bash
npm start -- --reset-cache
```

### Issue: App crashes on startup
**Solution**: 
1. Make sure all dependencies are installed
2. Check that all files are present in the correct directories
3. Clear cache and restart: `npm start -- --reset-cache`

### Issue: Language not changing
**Solution**: Language preference is stored in AsyncStorage. Make sure the app has storage permissions.

## 📱 Testing the App

1. **First Time User Flow**:
   - Open app → Welcome screen
   - Click "Sign Up"
   - Fill in details → Submit
   - Select role (Farmer/Buyer)
   - Set 4-digit PIN
   - Reach Home screen

2. **Returning User Flow**:
   - Open app → PIN Unlock screen
   - Enter PIN → Home screen

3. **Language Toggle**:
   - Click language toggle button (top right)
   - Switch between English and Hindi
   - All text should update immediately

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - [bhandariyash76](https://github.com/bhandariyash76)

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors and testers

---

**Note**: Make sure to install all dependencies before running the app. If you encounter any issues, check the troubleshooting section or open an issue on GitHub.
