import { useNavigation } from "@react-navigation/core";
import React from 'react';
import { auth } from "../../../firebase";
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

    const handleGoToProfile = () => {
        navigation.navigate('ProfileScreen');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Bonnes Adresses</Text>
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
            <TouchableOpacity
                onPress={handleGoToProfile}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Go to profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.logoutButton}
            >
                <Text style={styles.buttonText}>Sign out</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    logoutButton: {
        backgroundColor: '#FF3342',
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