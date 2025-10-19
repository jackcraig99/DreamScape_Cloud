import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { auth } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import RecordScreen from './Screens/RecordScreen';
import JournalScreen from './Screens/JournalScreen'; // Import the new screen

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// This component will be shown after the user logs in
// It contains the main app interface with the bottom tabs
function MainAppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // If a user is logged in, show the main tab navigator
          <Stack.Screen
            name="MainApp"
            component={MainAppTabs}
            options={{ headerShown: false }} // Hide the stack header for the tab screen
          />
        ) : (
          // If no user is logged in, show the authentication screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
