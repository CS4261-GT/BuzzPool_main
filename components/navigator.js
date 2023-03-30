
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "../screens/ProfileScreen";
import { RiderScreen } from "../screens/RiderScreen";
import { View } from "react-native";
import { DriverScreen } from "../screens/DriverScreen";

const Tab = createBottomTabNavigator();

const tempProfile = () => {
  return 
    <View>
      User profile 
    </View>
}

export const Navigator = () => {
  return (
    <Tab.Navigator
    // displayedName='Buzzpool'
    >

      <Tab.Screen
        name="Rider"
        component={RiderScreen}

        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Driver"
        component={DriverScreen}

        options={{ headerShown: false }}
      />
      {/* <Tab.Screen name="Provider" component={Provider} /> */}
      <Tab.Screen
        name="Setting"
        component={tempProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>

  )
}
