
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "../screens/ProfileScreen";
import { RiderScreen } from "../screens/RiderScreen";
import { View } from "react-native";
import { DriverScreen } from "../screens/DriverScreen";
import { MytripScreen } from "../screens/MyTripScreen";
import { MyChatScreen } from "../screens/MyChatScreen";
import SettingScreen from "../screens/SettingScreen";
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();


export const Navigator = () => {

  return (
    <Tab.Navigator
    // displayedName='Buzzpool'
    >
      <Tab.Screen
        name="Chat"
        component={MyChatScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="comments-o" size={size} color={color} />
          ),
          headerShown: false
        }}
      />

      <Tab.Screen
        name="MyTrip"
        component={MytripScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
          headerShown: false
        }}
      />

      <Tab.Screen
        name="Trips"
        component={RiderScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="car" size={size} color={color} />
          ),
          headerShown: false
        }}
      />

      {/* <Tab.Screen
        name="Trips"
        component={DriverScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="car" size={size} color={color} />
          ),
          headerShown: false
        }}
      /> */}
      {/* <Tab.Screen name="Provider" component={Provider} /> */}
      <Tab.Screen
        name="Setting"
        component={SettingScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
            {/* <Tab.Screen
        name="Settings"
        component={SettingScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" size={size} color={color} />
          ),
          headerShown: false
        }} */}
      {/* /> */}
    </Tab.Navigator>

  )
}
