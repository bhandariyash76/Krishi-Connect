// README: AppNavigator wires up stack screens including auth and feed flows.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeFeedScreen from '../screens/HomeFeedScreen';
import CropDetailScreen from '../screens/CropDetailScreen';
import AddCropScreen from '../screens/AddCropScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReviewsScreen from '../screens/ReviewsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="HomeFeed" component={HomeFeedScreen} />
        <Stack.Screen name="CropDetail" component={CropDetailScreen} />
        <Stack.Screen name="AddCrop" component={AddCropScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// NOTE: in LoginScreen, after successful login call navigation.replace('HomeFeed');

