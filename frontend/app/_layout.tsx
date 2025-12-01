import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LanguageProvider } from '@/contexts/LanguageContext';

import { ChatProvider } from '@/contexts/ChatContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LanguageProvider>
      <ChatProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="role-selection" />

            <Stack.Screen name="home" />
            <Stack.Screen name="add-product" />
            <Stack.Screen name="chat/index" />
            <Stack.Screen name="chat/[id]" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ChatProvider>
    </LanguageProvider>
  );
}

