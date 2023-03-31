
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "../screens/ProfileScreen";
import { RiderScreen } from "../screens/RiderScreen";
import { View } from "react-native";
import { DriverScreen } from "../screens/DriverScreen";
import { MytripScreen } from "../screens/MyTripScreen";
import { userConverter, usersCollection } from "../logic/userHandler";
import { carpoolCollection } from "../logic/carpoolHandler";
import { auth } from "../api/firebase";

const Tab = createBottomTabNavigator();

const TempProfile = () => {
  return 
    <View>
      <Text>User profile </Text>
      
    </View>
}

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
        component={TempProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>

  )
}
