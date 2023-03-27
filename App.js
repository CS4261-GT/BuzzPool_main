import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator,  } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import ServiceScreen from './screens/ServiceScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen'
import { Navigator } from './components/navigator'


function Provider() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Provide a service!</Text>
    </View>
  );
}




// <Tab.Navigator>
// <Tab.Screen name="Service" component={ServiceScreen} />
// <Tab.Screen name="Provider" component={Provider} />
// <Tab.Screen name="User" component={ProfileScreen} />
// <Tab.Screen name="Login" component={LoginScreen} />
// </Tab.Navigator>


const Stack = createNativeStackNavigator();




export default function App() {


  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen 
          name="Navigator" 
          component={Navigator} 
          options={{title: 'Buzzpool'}}
        />
        
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
