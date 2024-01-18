import { Button, StyleSheet, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

    const signUp = () => {
        console.log("auth", auth);
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Registered user : ", user);
            })
            .catch((error) => {
                console.error('Sign up error:', error.message);
                alert(error.message);
            });
    }

    const signIn = () => {
        console.log("auth", auth);
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Current user : ", user);
            })
            .catch((error) => {
                console.error('Sign in error:', error.message);
                alert(error.message);
            });
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Email" onChangeText={text => setEmail(text)} value={email}/>
            <TextInput style={styles.input} textContentType={"password"} placeholder="Mot de passe" onChangeText={text => setPassword(text)} value={password} secureTextEntry/>

            <Button title={"Create account"} onPress={signUp} />
            <Button title={"Sign In"} onPress={signIn} />
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flexDirection: "column",
        paddingVertical:20,
    },
    input: {
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
})
