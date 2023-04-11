import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RiderScreen from './screens/RiderScreen';
import HomeScreen from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import { Navigator } from './components/navigator';
import { auth } from './api/firebase';


const Stack = createNativeStackNavigator();




export default function App() {


  return (

    <NavigationContainer>
<Stack.Navigator>
  {auth.currentUser ? (
    <>
      <Stack.Screen
        name="Navigator"
        component={Navigator}
        options={{
          title: 'Buzzpool',
          gestureEnabled: false,
          // headerBackVisible: false 
        }}
      />
      <Stack.Screen
        name="ChatScreen" // Add ChatScreen as a screen
        component={ChatScreen}
        options={{
          title: 'ChatScreen',
          gestureEnabled: false,
          // headerBackVisible: false
        }}
      />
    </>
  ) : (
    <>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Add to Your Profile',
          gestureEnabled: false,
          // headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'ChatScreen',
          gestureEnabled: false,
          // headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="Navigator"
        component={Navigator}
        options={{
          title: 'Buzzpool',
          gestureEnabled: false,
          // headerLeft: () => {}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
