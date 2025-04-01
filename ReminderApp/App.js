import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import HomeScreen from './src/screens/HomeScreen';
import SetReminder from './src/screens/SetReminder';
import CustomHeader from './src/screens/CustomHeader';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            header: () => <CustomHeader />,
          }}
        />
        <Stack.Screen
          name="SetReminder"
          component={SetReminder}
          options={{
            title: 'New Reminder',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
