import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import TabNavigator from "./app/screens/TabNavigator";
import { useAuthState } from "react-firebase-hooks/auth";
const Stack = createNativeStackNavigator();

export default function App() {


    return (
        <NavigationContainer>
            <TabNavigator/>
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