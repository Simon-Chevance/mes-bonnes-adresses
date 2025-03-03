import {ActivityIndicator, Button, StyleSheet, TextInput, View, Text, TouchableOpacity} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                console.log("User id :", uid);
            } else {
                console.log("Not logged in")
            }
        });
    }, []);

    const signUp = async () => {
        setLoading(true);
        console.log("auth", auth);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log("Registered user : ", user);
                })
        } catch (error) {
            console.error('Sign up error:', error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    const signIn = () => {
        console.log("auth", auth);
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Current user : ", user);
                navigation.replace("Home");
            })
            .catch((error) => {
                console.error('Sign in error:', error.message);
                alert(error.message);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Bonnes Adresses</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={text => setEmail(text)} value={email}/>
            <TextInput style={styles.input} textContentType={"password"} placeholder="Mot de passe" onChangeText={text => setPassword(text)} value={password} secureTextEntry/>

            {loading ?(
                <ActivityIndicator size="large" color="#0000ff"/>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={signIn}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={signUp}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex:1,
        justifyContent: 'center',
    },
    input: {
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
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
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
