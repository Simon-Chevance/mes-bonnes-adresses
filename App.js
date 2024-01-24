import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import Home from './app/screens/(tabs)/Home';
import MapScreen from "./app/screens/(tabs)/MapScreen";
import ProfileScreen from "./app/screens/(tabs)/ProfileScreen";
import AddressList from "./app/screens/(tabs)/AddressList";
import EditProfile from './app/screens/EditProfile';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="AddressList" component={AddressList} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
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