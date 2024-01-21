import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import TabNavigator from "./app/screens/TabNavigator";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { ActivityIndicator } from "react-native";
const Stack = createNativeStackNavigator();

export default function App() {


    const [user, loading] = useAuthState(auth);
    return (
        <NavigationContainer>
        {loading ? (
            <ActivityIndicator size="large" />
        ) : (
            <Stack.Navigator>
                {user ? (
                <Stack.Screen
                    name="TabNavigator"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
              <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
              )}
           </Stack.Navigator>
        )}
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