
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "../screens/ProfileScreen";
import ServiceScreen from "../screens/ServiceScreen";

const Tab = createBottomTabNavigator();
export const Navigator = () => {
    return (
            <Tab.Navigator
                // displayedName='Buzzpool'
            >
                
                <Tab.Screen name="Service" component={ServiceScreen} />
                {/* <Tab.Screen name="Provider" component={Provider} /> */}
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        
    )
}
