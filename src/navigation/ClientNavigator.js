import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/client/HomeScreen';
import RequestRideScreen from '../screens/client/RequestRideScreen';
import RideDetailsScreen from '../screens/client/RideDetailsScreen';
import ProfileScreen from '../screens/client/ProfileScreen';
import RideHistoryScreen from '../screens/client/RideHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'Acasă' }} 
      />
      <Stack.Screen 
        name="RequestRide" 
        component={RequestRideScreen} 
        options={{ title: 'Solicită o cursă' }} 
      />
      <Stack.Screen 
        name="RideDetails" 
        component={RideDetailsScreen} 
        options={{ title: 'Detalii cursă' }} 
      />
    </Stack.Navigator>
  );
};

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HistoryMain" 
        component={RideHistoryScreen} 
        options={{ title: 'Istoric curse' }} 
      />
      <Stack.Screen 
        name="RideDetails" 
        component={RideDetailsScreen} 
        options={{ title: 'Detalii cursă' }} 
      />
    </Stack.Navigator>
  );
};

const ClientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ 
          headerShown: false,
          title: 'Acasă'
        }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStack} 
        options={{ 
          headerShown: false,
          title: 'Istoric'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }} 
      />
    </Tab.Navigator>
  );
};

export default ClientNavigator;