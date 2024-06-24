import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Job from './Screen/Job';
import Bookmark from './Screen/Bookmark';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import JobDetails from './Screen/JobDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function JobNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Job') {
            iconName = focused ? 'briefcase-variant' : 'briefcase-variant-outline';
          } else if (route.name === 'Bookmark') {
            iconName = focused ? 'bookmark-check' : 'bookmark-check-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen name="Job" component={Job} />
      <Tab.Screen name="Bookmark" component={Bookmark} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="JobNavigator" component={JobNavigator} />
        <Stack.Screen name="JobDetails" component={JobDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
