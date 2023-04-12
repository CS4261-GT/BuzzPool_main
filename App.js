
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RiderScreen from './screens/RiderScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen'
import { Navigator } from './components/navigator'
import { auth } from './api/firebase';
import React, { useEffect } from 'react';
import registerNNPushToken from 'native-notify';
import { SingleTripScreen } from './screens/SingleTripScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  registerNNPushToken(7334, 'd1AFABt39G4VjuJZ4ymIbt');

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth.currentUser ? (
          <>
            <Stack.Screen
              name="Navigator"
              component={Navigator}
              options={{
                title: "Buzzpool",
                gestureEnabled: false,
                // headerBackVisible: false
              }}
            />
            {/* <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                title: "ChatScreen",
                // gestureEnabled: false,
                // headerBackVisible: false
              }}
            /> */}
            <Stack.Screen
              name="SingleTripScreen"
              component={SingleTripScreen}
              options={{
                title: "placeholder",
                // gestureEnabled: false,
                // headerBackVisible: false
              }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                title: "ChatScreen",
                // gestureEnabled: false,
                // headerBackVisible: false
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Welcome" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Add to Your Profile",
                // gestureEnabled: false,
                // headerBackVisible: false
              }}
            />
            <Stack.Screen
              name="Navigator"
              component={Navigator}
              options={{
                title: "Buzzpool",
                // gestureEnabled: false,
                // headerLeft: () => {}
                // headerBackVisible: false
              }}
            />
            <Stack.Screen
              name="SingleTripScreen"
              component={SingleTripScreen}
              options={{
                title: "placeholder",
                // gestureEnabled: false,
                // headerBackVisible: false
              }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                title: "ChatScreen",
                // gestureEnabled: false,
                // headerBackVisible: false
              }}
            />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
