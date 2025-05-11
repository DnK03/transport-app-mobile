import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverRideDetailsScreen from '../screens/driver/DriverRideDetailsScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import DriverHistoryScreen from '../screens/driver/DriverHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DriverHomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DriverHomeMain" 
        component={DriverHomeScreen} 
        options={{ title: 'Curse disponibile' }} 
      />
      <Stack.Screen 
        name="DriverRideDetails" 
        component={DriverRideDetailsScreen} 
        options={{ title: 'Detalii cursă' }} 
      />
    </Stack.Navigator>
  );
};

const DriverHistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DriverHistoryMain" 
        component={DriverHistoryScreen} 
        options={{ title: 'Istoric curse' }} 
      />
      <Stack.Screen 
        name="DriverRideDetails" 
        component={DriverRideDetailsScreen} 
        options={{ title: 'Detalii cursă' }} 
      />
    </Stack.Navigator>
  );
};

const DriverNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DriverHome') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'DriverHistory') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'DriverProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="DriverHome" 
        component={DriverHomeStack} 
        options={{ 
          headerShown: false,
          title: 'Curse'
        }} 
      />
      <Tab.Screen 
        name="DriverHistory" 
        component={DriverHistoryStack} 
        options={{ 
          headerShown: false,
          title: 'Istoric'
        }} 
      />
      <Tab.Screen 
        name="DriverProfile" 
        component={DriverProfileScreen} 
        options={{ title: 'Profil' }} 
      />
    </Tab.Navigator>
  );
};

export default DriverNavigator;