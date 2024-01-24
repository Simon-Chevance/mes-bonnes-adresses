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

    const handleGoToProfile = () => {
        navigation.navigate('ProfileScreen');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Bonnes Adresses</Text>
            <TouchableOpacity
                onPress={handleGoToMap}
                style={styles.buttonMap}
            >
                <Text style={styles.buttonText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleGoToAddressList}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Addresses</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleGoToProfile}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.logoutButton}
            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333333',
    },
    button: {
        backgroundColor: '#3498db', 
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
    },
    buttonMap: {
        backgroundColor: '#3498db', 
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 100,
        elevation: 2,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    },
});
