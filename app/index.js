import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import ClientNavigator from '../src/navigation/ClientNavigator';
import DriverNavigator from '../src/navigation/DriverNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ClientHome" component={ClientNavigator} />
        <Stack.Screen name="DriverHome" component={DriverNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}