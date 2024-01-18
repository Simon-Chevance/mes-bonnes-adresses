import {View, Text, Button, TextInput, StyleSheet} from "react-native";
import React from "react";
import { getAuth } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const auth = getAuth();
    const signUp = async () => {

    }

    const signIn = async () => {

    }
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Email" onChangeText={() => setEmail()} value={email}/>
            <TextInput style={styles.input} textContentType={"password"} placeholder="Mot de passe" onChangeText={() => setPassword()} value={password}/>

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
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
})
