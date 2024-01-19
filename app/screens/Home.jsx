import { useNavigation } from "@react-navigation/core";
import React from 'react';
import { auth } from "../../firebase";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Home = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch(error => alert(error.message));
    }

    const handleGoToMap = () => {
        navigation.navigate('MapScreen');
    }

    const handleGoToAddressList = () => {
        navigation.navigate('AddressList');
    }

    return (
        <View style={styles.container}>
            <Text>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleGoToMap}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Go to map</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleGoToAddressList}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Go to addresses list</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})