import React, {useState} from 'react'
import {View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StyleSheet, TextInput} from 'react-native'
import { auth } from "../../firebase";
import {getAuth} from "firebase/auth";

const EditProfile = () => {
    const auth = getAuth();
    const [password, setPassword] = useState("");
    return (
        <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                showsVerticalScrollIndicator={false}
            >
                <Image
                    style={styles.userImg}
                    source={require('../../assets/users/user-1.jpg')}
                />
                <TextInput placeholder={auth.currentUser?.email} style={styles.userName}></TextInput>
                <TextInput textContentType={"password"} style={styles.input} placeholder="Password" onChangeText={text => setPassword(text)} value={password} secureTextEntry/>
                {/*TODO : Add a confirm password field + check if the password is correct + function to update the password*/}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        alert("Password updated");
                    }}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#fff",
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: "#333333",
    },
    input: {
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
        width: '60%',
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    userName: {
        paddingTop: 10,
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
        width: '60%',
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
    },
    userBtnWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginBottom: 10,
    },
    userBtn: {
        borderColor: "#2e64e5",
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
    },
    userBtnTxt: {
        color: "#2e64e5",
    },
    userInfoWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: "center",
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    userInfoSubTitle: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
})