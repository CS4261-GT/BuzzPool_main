
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "../screens/ProfileScreen";
import ServiceScreen from "../screens/ServiceScreen";
import { View } from "react-native";

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
        name="Service"
        component={ServiceScreen}

        options={{ headerShown: false }}
      />
      {/* <Tab.Screen name="Provider" component={Provider} /> */}
      <Tab.Screen
        name="Profile"
        component={tempProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>

  )
}
