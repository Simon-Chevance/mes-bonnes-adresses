import { Button, StyleSheet, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/core";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();

    const auth = getAuth();
    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home");
            }
        });
    }, []);

    const signUp = async () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Registered user : ", user);
            })
            .catch(error => alert(error.message));
    }

    const signIn = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Current user : ", user);
            })
            .catch(error => alert(error.message));
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
