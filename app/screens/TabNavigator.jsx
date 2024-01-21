import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./(tabs)/Home";
import ProfileScreen from "./(tabs)/ProfileScreen";
import MapScreen from "./(tabs)/MapScreen";
import AddressList from "./(tabs)/AddressList";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>

            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="MapScreen" component={MapScreen}/>
            <Tab.Screen name="AddressList" component={AddressList}/>
            <Tab.Screen name="ProfileScreen" component={ProfileScreen}/>
        </Tab.Navigator>
    )
}

export default TabNavigator;