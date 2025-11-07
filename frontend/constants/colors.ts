// Green and white color palette for farmer marketplace app
export const AppColors = {
  primary: '#2E7D32', // Forest green
  primaryLight: '#4CAF50', // Light green
  primaryDark: '#1B5E20', // Dark green
  secondary: '#66BB6A', // Secondary green
  accent: '#81C784', // Accent green
  background: '#FFFFFF', // White
  backgroundLight: '#F5F5F5', // Light gray
  text: '#212121', // Dark text
  textSecondary: '#757575', // Secondary text
  textLight: '#FFFFFF', // White text
  border: '#E0E0E0', // Light border
  shadow: '#000000', // Shadow color
  error: '#D32F2F', // Error red
  success: '#388E3C', // Success green
  card: '#FFFFFF', // Card background
  cardShadow: 'rgba(0, 0, 0, 0.1)', // Card shadow
};

export const AppStyles = {
  shadow: {
    shadowColor: AppColors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardShadow: {
    shadowColor: AppColors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
  },
};

