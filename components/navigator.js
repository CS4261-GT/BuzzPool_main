
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "../screens/ProfileScreen";
import { RiderScreen } from "../screens/RiderScreen";
import { View } from "react-native";
import { DriverScreen } from "../screens/DriverScreen";
import { MytripScreen } from "../screens/MyTripScreen";
import ReportScreen from "../screens/ReportScreen";
import { userConverter, usersCollection } from "../logic/userHandler";
import { carpoolCollection } from "../logic/carpoolHandler";
import { auth } from "../api/firebase";
import { SettingScreen } from "../screens/SettingScreen";

const Tab = createBottomTabNavigator();


export const Navigator = () => {

  return (
    <Tab.Navigator
    // displayedName='Buzzpool'
    >

      <Tab.Screen
        name="My Trip"
        component={MytripScreen}

        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Requests"
        component={RiderScreen}

        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Trips"
        component={DriverScreen}

        options={{ headerShown: false }}
      />
      {/* <Tab.Screen name="Provider" component={Provider} /> */}
      <Tab.Screen
        name="Report"
        component={ReportScreen}

        options={{ headerShown: false }}
      />
    </Tab.Navigator>

  )
}
